import { Highcharts, HighchartsReact, useTheme } from "@/common/imports";

if (typeof HighchartsMore === "function") HighchartsMore(Highcharts);

const statusColorMap = {
  Low: "#FF695B", // Red
  Medium: "#DDD427", // Yellow
  High: "#0CB91D", // Green
};

export default function YearlySalesTrendLines({ data, height = 300 }) {
  const { darkMode } = useTheme();
  const themeTextColor = darkMode ? "#737791" : "#737791";

  const categories = Object.keys(data);

  const rangeData = [];
  const scatterData = [];

  categories.forEach((month, index) => {
    const entry = data[month] || { value: 0, status: "Low" };
    const color = statusColorMap[entry.status] || "#9CA3AF";

    rangeData.push({
      x: index,
      low: 0,
      high: entry.value,
      color: {
        linearGradient: { x1: 0, y1: 1, x2: 0, y2: 0 },
        stops: [
          [0, `${color}26`],
          [1, `${color}80`],
        ],
      },
    });

    scatterData.push({
      x: index,
      y: entry.value,
      marker: {
        fillColor: color,
        lineColor: color,
        lineWidth: 2,
        radius: 3,
      },
    });
  });

  const options = {
    chart: {
      type: "columnrange",
      height,
      backgroundColor: darkMode ? "black" : "#ffffff",
    },
    title: { text: null },
    xAxis: {
      categories,
      tickmarkPlacement: "on",
      lineWidth: 0,
      labels: {
        style: {
          fontSize: "12px",
          color: themeTextColor,
        },
      },
    },
    yAxis: {
      title: { text: null },
      labels: { enabled: false },
      gridLineWidth: 0,
      lineWidth: 0,
      tickLength: 0,
    },
    plotOptions: {
      columnrange: {
        grouping: false,
        pointWidth: 2, // thin line
        borderWidth: 0,
        dataLabels: { enabled: false },
      },
      scatter: {
        marker: {
          symbol: "circle",
        },
      },
    },
    series: [
      {
        name: "Sales Lines",
        type: "columnrange",
        data: rangeData,
        showInLegend: false,
      },
      {
        name: "Sales Dots",
        type: "scatter",
        data: scatterData,
        showInLegend: false,
      },
    ],
    tooltip: {
      formatter: function () {
        const value = this.point.y ?? this.point.high;
        return `${value}`;
      },
      backgroundColor: "#ffffff",
      borderRadius: 8,
      shadow: false,
      style: {
        color: "#000000",
        fontSize: "12px",
        fontWeight: "500",
        padding: "8px",
      },
      borderWidth: 1,
      borderColor: "#e5e7eb",
      useHTML: true,
    },
    credits: { enabled: false },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
