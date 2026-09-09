import { Highcharts, HighchartsReact } from "@/common/imports";

export default function TrendLineChart({
  data = [1, 3, 2, 4, 5],
  height = 100,
  width = 200,
}) {
  const smoothData = [data[0] - 1, ...data, data[data.length - 1] + 1];

  const options = {
    chart: {
      type: "spline",
      backgroundColor: "transparent",
      height,
      width,
    },
    title: { text: null },
    accessibility: {
      enabled: false,
    },
    xAxis: { visible: false },
    yAxis: { visible: false },
    legend: { enabled: false },
    tooltip: { enabled: false },
    credits: { enabled: false },
    plotOptions: {
      spline: {
        marker: { enabled: false },
        lineWidth: 5,
      },
      series: {
        enableMouseTracking: false,
      },
    },
    series: [
      {
        data: smoothData,
        color: "#09A711",
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
