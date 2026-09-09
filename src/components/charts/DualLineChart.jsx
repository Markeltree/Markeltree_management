import React, { useMemo, useId, useState, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function DualLineChart({
  data = [],
  height = 260,
  className = "",
  range = "This Year",
}) {
  const uid = useId();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Detect small screen
  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Parse data and generate X values
  const parsed = useMemo(() => {
    if (!Array.isArray(data)) return [];

    if (range === "This Year") {
      return data.map((d) => {
        const dt = d.date instanceof Date ? d.date : new Date(d.date);
        return {
          _date: dt,
          ts: dt.getTime(),
          expected: Number(d.expected),
          actual: Number(d.actual),
        };
      });
    }

    // For This Month and This Week, use category X axis
    return data.map((d, i) => ({
      _date: d.date,
      ts: d.date,
      expected: Number(d.expected),
      actual: Number(d.actual),
    }));
  }, [data, range]);

  // Generate ticks for "This Year"
  const monthTicks = useMemo(() => {
    if (range !== "This Year") return undefined;
    const allMonths = Array.from({ length: 12 }, (_, idx) => {
      const monthDate = new Date(
        parsed[0]?._date?.getFullYear() || new Date().getFullYear(),
        idx,
        1
      );
      return monthDate.getTime();
    });
    // On small screens, show every other month
    return isSmallScreen ? allMonths.filter((_, i) => i % 2 === 0) : allMonths;
  }, [range, parsed, isSmallScreen]);

  // Generate ticks for "This Month"
  const monthDayTicks = useMemo(() => {
    if (range !== "This Month") return parsed.map((d) => d.ts);
    // On small screens, show every other day
    return isSmallScreen
      ? parsed.filter((_, i) => i % 2 === 0).map((d) => d.ts)
      : parsed.map((d) => d.ts);
  }, [range, parsed, isSmallScreen]);

  const yDomain = useMemo(() => {
    if (!parsed.length) return [0, 100];
    let min = Infinity;
    let max = -Infinity;
    parsed.forEach((d) => {
      min = Math.min(min, d.expected, d.actual);
      max = Math.max(max, d.expected, d.actual);
    });
    if (!isFinite(min) || !isFinite(max)) return [0, 100];
    const pad = (max - min) * 0.08 || 10;
    return [Math.floor(min - pad), Math.ceil(max + pad)];
  }, [parsed]);

  const lineBlue = `lineBlue-${uid}`;
  const lineRed = `lineRed-${uid}`;
  const areaBlue = `areaBlue-${uid}`;
  const areaRed = `areaRed-${uid}`;

  return (
    <div
      className={`w-full ${className} bg-white dark:bg-black`}
      style={{ height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={parsed}
          margin={{ top: 10, right: 0, bottom: 8, left: 0 }}
        >
          <defs>
            <linearGradient id={lineBlue} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7CC2FF" />
              <stop offset="50%" stopColor="#3FA0FF" />
              <stop offset="100%" stopColor="#2E90FA" />
            </linearGradient>
            <linearGradient id={lineRed} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FF8A8A" />
              <stop offset="50%" stopColor="#FF6B6B" />
              <stop offset="100%" stopColor="#F04438" />
            </linearGradient>
            <linearGradient id={areaBlue} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(46,144,250,0.18)" />
              <stop offset="40%" stopColor="rgba(46,144,250,0.10)" />
              <stop offset="100%" stopColor="rgba(46,144,250,0.00)" />
            </linearGradient>
            <linearGradient id={areaRed} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(240,68,56,0.18)" />
              <stop offset="40%" stopColor="rgba(240,68,56,0.10)" />
              <stop offset="100%" stopColor="rgba(240,68,56,0.00)" />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="ts"
            type={range === "This Year" ? "number" : "category"}
            domain={range === "This Year" ? ["dataMin", "dataMax"] : undefined}
            ticks={range === "This Year" ? monthTicks : monthDayTicks}
            interval={0}
            padding={{ left: 24, right: 24 }}
            tickFormatter={(val) => {
              if (range === "This Year") {
                return new Date(val).toLocaleString(undefined, {
                  month: "short",
                });
              }
              if (range === "This Month") return val; // just number
              return val;
            }}
            axisLine={false}
            tickLine={false}
            tick={{ className: "fill-[#8E8E9C] dark:fill-white", fontSize: 12 }}
          />

          <YAxis hide domain={yDomain} yAxisId="y" type="number" />

          <Tooltip cursor={false} content={<CustomTooltip range={range} />} />

          <Area
            type="monotone"
            dataKey="expected"
            stroke="none"
            fill={`url(#${areaBlue})`}
            baseValue={yDomain[0]}
            yAxisId="y"
            isAnimationActive
            animationDuration={1500}
            animationBegin={0}
            connectNulls
          />
          <Area
            type="monotone"
            dataKey="actual"
            stroke="none"
            fill={`url(#${areaRed})`}
            baseValue={yDomain[0]}
            yAxisId="y"
            isAnimationActive
            animationDuration={1500}
            animationBegin={0}
            connectNulls
          />

          <Line
            type="monotone"
            dataKey="expected"
            stroke={`url(#${lineBlue})`}
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 4 }}
            strokeLinecap="round"
            yAxisId="y"
            isAnimationActive
            animationDuration={1500}
            animationBegin={0}
          />
          <Line
            type="monotone"
            dataKey="actual"
            stroke={`url(#${lineRed})`}
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 4 }}
            strokeLinecap="round"
            yAxisId="y"
            isAnimationActive
            animationDuration={1500}
            animationBegin={0}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function CustomTooltip({ active, payload, range }) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0].payload || {};
  let dateStr = "";

  if (
    range === "This Year" &&
    point._date instanceof Date &&
    !isNaN(point._date)
  ) {
    dateStr = point._date.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } else if (range === "This Month") {
    dateStr = point._date;
  } else if (range === "This Week") {
    dateStr = point._date;
  } else {
    dateStr = point._date;
  }

  const expected =
    payload.find((p) => p.dataKey === "expected")?.value ?? point.expected;
  const actual =
    payload.find((p) => p.dataKey === "actual")?.value ?? point.actual;

  return (
    <div className="rounded-xl bg-white dark:bg-[#1f2937] px-3 py-2 shadow-[0_8px_28px_rgba(0,0,0,0.08)] border border-gray-200 dark:border-gray-700">
      <div className="text-[10px] font-semibold text-[#101828] dark:text-gray-200 leading-none mb-1">
        {dateStr}
      </div>
      <div className="flex gap-3">
        <div className="text-[12px] leading-none text-gray-700 dark:text-gray-100">
          <span style={{ color: "#2E90FA" }}>●</span>{" "}
          <span className="font-medium">Expected:</span>{" "}
          <span className="font-bold text-[#0B7A3B] dark:text-green-400">
            {formatNumeric(expected)}
          </span>
        </div>
        <div className="text-[12px] leading-none text-gray-700 dark:text-gray-100">
          <span style={{ color: "#F04438" }}>●</span>{" "}
          <span className="font-medium">Actual:</span>{" "}
          <span className="font-bold text-[#A61B1B] dark:text-red-400">
            {formatNumeric(actual)}
          </span>
        </div>
      </div>
    </div>
  );
}

function formatNumeric(v) {
  if (v === null || v === undefined || isNaN(v)) return "--";
  try {
    return new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 0,
    }).format(v);
  } catch (_) {
    return String(v);
  }
}
