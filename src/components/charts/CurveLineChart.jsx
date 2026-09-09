import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const CurveLineChart = ({ data, color, width = 100, height = 60 }) => {
  const options = {
    chart: {
      type: "spline",
      backgroundColor: "transparent",
      height,
      width,
      spacing: [0, 0, 0, 0], // top, right, bottom, left
      margin: [0, 0, 0, 0],
      animation: { duration: 1000 }, // animation for the chart load
    },
    title: { text: null },
    xAxis: {
      visible: false,
      startOnTick: false,
      endOnTick: false,
    },
    yAxis: {
      visible: false,
      startOnTick: false,
      endOnTick: false,
    },
    tooltip: { enabled: false },
    legend: { enabled: false },
    credits: { enabled: false },
    plotOptions: {
      spline: {
        lineWidth: 4,
        marker: { enabled: false },
        enableMouseTracking: false,
        shadow: false,
        crisp: false,
      },
      series: {
        color,
        animation: { duration: 1000, easing: "easeOutSine" }, // animate line drawing
        clip: false, // prevent clipping
      },
    },
    series: [
      {
        data,
        animation: { duration: 1000, easing: "easeOutSine" }, // ensure series animates
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default CurveLineChart;
