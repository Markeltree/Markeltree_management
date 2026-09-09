import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export default function TrendLineHighchart({
  data = [1, 3, 5, 5, 4, 7, 6, 8],
  width = 120,
  height = 80,
  trend = "up", // 'up' or 'down'
}) {
  const strokeColor = trend === "down" ? "#EF4444" : "#22C55E";

  // Add small buffer for smooth edges
  const smoothData = [data[0] - 1, ...data, data[data.length - 1] + 1];
  const maxY = Math.max(...smoothData);

  // Build series with explicit x and y
  const seriesData = smoothData.map((val, idx) => {
    if (trend === "up") return { x: idx, y: val }; // normal: left → right, bottom → top
    // down: x decreasing (right → left), y inverted (top → bottom)
    return { x: idx, y: val };
  });

  const options = {
    chart: {
      type: "spline",
      backgroundColor: "transparent",
      height,
      width,
      animation: true,
    },
    title: { text: null },
    credits: { enabled: false },
    tooltip: { enabled: false },
    xAxis: { visible: false },
    yAxis: { visible: false },
    legend: { enabled: false },
    plotOptions: {
      series: {
        animation: { duration: 1000 },
        marker: { enabled: false },
        lineWidth: 3,
        states: { hover: { enabled: false } },
      },
      spline: { fillOpacity: 0.15 },
    },
    series: [
      {
        type: "areaspline",
        data: seriesData,
        color: strokeColor,
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, Highcharts.color(strokeColor).setOpacity(0.15).get("rgba")],
            [1, Highcharts.color(strokeColor).setOpacity(0).get("rgba")],
          ],
        },
        enableMouseTracking: false,
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
