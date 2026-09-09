// ResponsiveTrendChart.jsx
import React, { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export default function ResponsiveTrendChart({ data = [], height, range }) {
  const chartRef = useRef(null);
  const containerRef = useRef(null);
  const [chartHeight, setChartHeight] = useState(height || 280);

  // 📏 Adjust height based on screen size
  useEffect(() => {
    const updateHeight = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setChartHeight(230); // Mobile
      } else if (width < 1024) {
        setChartHeight(250); // Tablet
      } else {
        setChartHeight(height || 265); // Desktop
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [height]);

  const seriesData =
    data.length > 0
      ? data
      : [
          { x: "Jan", y: 70000, cartons: 52 },
          { x: "Feb", y: 40000, cartons: 56 },
          { x: "Mar", y: 100000, cartons: 54 },
          { x: "Apr", y: 50000, cartons: 50 },
          { x: "May", y: 75000, cartons: 48 },
          { x: "Jun", y: 35577, cartons: 45 },
          { x: "Jul", y: 90000, cartons: 38 },
          { x: "Aug", y: 50000, cartons: 40 },
          { x: "Sep", y: 54000, cartons: 44 },
        ];

  // ✅ X-Axis config changes based on range
  const xAxisConfig =
    range === "This Year"
      ? {
          categories: seriesData.map((d) => d.x), // Jan, Feb...
          labels: { style: { color: "#9CA3AF", fontSize: "12px" } },
          lineColor: "transparent",
          tickLength: 0,
          gridLineWidth: 0,
        }
      : range === "This Month"
      ? {
          categories: seriesData.map((d) => d.x.toString()), // 1, 2, 3...
          labels: { style: { color: "#9CA3AF", fontSize: "12px" } },
          lineColor: "transparent",
          tickLength: 0,
          gridLineWidth: 0,
        }
      : {
          categories: seriesData.map((d) => d.x), // Mon, Tue...
          labels: { style: { color: "#9CA3AF", fontSize: "12px" } },
          lineColor: "transparent",
          tickLength: 0,
          gridLineWidth: 0,
        };

  const options = {
    chart: {
      type: "areaspline",
      backgroundColor: "transparent",
      spacing: [10, 12, 20, 12],
      height: chartHeight, // 🔹 Responsive height
    },
    title: { text: null },
    credits: { enabled: false },
    legend: { enabled: false },
    xAxis: xAxisConfig,
    yAxis: {
      title: { text: null },
      labels: { enabled: false },
      gridLineWidth: 0,
      gridLineColor: "rgba(15,23,42,0.03)",
      startOnTick: false,
      endOnTick: false,
    },
    tooltip: {
      useHTML: true,
      backgroundColor: "#fff",
      borderWidth: 0,
      shadow: true,
      padding: 0,
      formatter: function () {
        const label = this.key; // ✅ Works for Year/Month/Week
        const value = Highcharts.numberFormat(this.y, 0);
        const cartons = this.point?.cartons ? this.point.cartons : "";
        return `
          <div style="padding:10px 12px; min-width:140px; border-radius:8px; box-shadow:0 8px 20px rgba(2,6,23,0.08);">
            <div style="font-size:12px;color:#6B7280;margin-bottom:6px">${label}</div>
            <div style="font-weight:700;font-size:15px;color:#0F172A;margin-bottom:4px">$${value}</div>
            <div style="font-size:12px;color:#6B7280">
              ${cartons ? `${cartons} Cartons Sold` : ""}
            </div>
          </div>
        `;
      },
      style: { pointerEvents: "auto" },
    },
    plotOptions: {
      series: { marker: { enabled: false } },
      areaspline: {
        fillOpacity: 1,
        lineWidth: 3,
        color: "#0096FF",
        marker: { enabled: false, radius: 4 },
      },
    },
    series: [
      {
        data: seriesData.map((d) => d.y),
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, "rgba(0,150,255,0.18)"],
            [0.4, "rgba(0,150,255,0.10)"],
            [1, "rgba(0,150,255,0.00)"],
          ],
        },
        linecap: "round",
      },
    ],
  };

  useEffect(() => {
    if (!containerRef.current || !chartRef.current) return;
    const ro = new ResizeObserver(() => {
      chartRef.current?.chart?.reflow();
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <div ref={containerRef} className="w-full flex-1">
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          ref={chartRef}
        />
      </div>
    </div>
  );
}
