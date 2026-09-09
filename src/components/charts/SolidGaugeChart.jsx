import { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsMore from "highcharts/highcharts-more";
import SolidGauge from "highcharts/modules/solid-gauge";
import { useTheme } from "../../context/ThemeContext";

if (typeof HighchartsMore === "function") HighchartsMore(Highcharts);
if (typeof SolidGauge === "function") SolidGauge(Highcharts);

export default function SolidGaugeChart({
  value = 72,
  max = 100,
  width = 120,
  height = 120,
  // radius = "100%",
  centerText = "Achieved",
  gradientColors = [
    [0, "#A0A2F8"],
    [1, "#5D5FEF"],
  ],
  valueStyle = "font-size:22px; font-weight:bold; color:#0CB91D;",
  textStyle = "font-size:12px; color:#737791;",
  outerRadius = "100%",
  innerRadius = "80%",
}) {
  const [isReady, setIsReady] = useState(true);
  const { darkMode } = useTheme();

  const gradientColor = {
    linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
    stops: gradientColors,
  };

  const options = {
    chart: {
      type: "solidgauge",
      backgroundColor: "transparent",
      height,
      width,
    },
    title: null,
    accessibility: {
      enabled: false,
    },
    pane: {
      center: ["50%", "50%"],
      size: "100%",
      startAngle: 0,
      endAngle: 360,
      background: {
        outerRadius: outerRadius,
        innerRadius: innerRadius,
        shape: "arc",
        backgroundColor: darkMode ? "#00003A" : "#E6E8FF",
        borderWidth: 0,
      },
    },
    tooltip: {
      enabled: false,
    },
    yAxis: {
      min: 0,
      max,
      lineWidth: 0,
      tickPositions: [],
    },
    plotOptions: {
      solidgauge: {
        rounded: true,
        dataLabels: {
          borderWidth: 0,
          useHTML: true,
          verticalAlign: "middle",
          y: 0,
          format: `
  <div style="
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: sans-serif;
    height: 100%;
    ${
      !centerText ? "transform: translateY(0);" : "transform: translateY(-5px);"
    }
  ">
    <span style="${valueStyle}">${value}%</span>
    ${centerText ? `<span style="${textStyle}">${centerText}</span>` : ""}
  </div>
`,
        },
        linecap: "round",
      },
    },
    series: [
      {
        name: "Progress",
        data: [
          {
            y: value,
            color: gradientColor,
          },
        ],
        innerRadius: "80%",
        radius: "100%",
      },
    ],
    credits: {
      enabled: false,
    },
  };

  return (
    isReady && (
      <HighchartsReact
        key={darkMode ? "dark" : "light"}
        highcharts={Highcharts}
        options={options}
      />
    )
  );
}
