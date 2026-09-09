import React, { useState, useEffect, useRef } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useTheme } from "../../context/ThemeContext"; // Adjust path as needed

ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart = ({ available, outOfStock }) => {
  const total = available + outOfStock;
  const chartRef = useRef();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { darkMode } = useTheme();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMediumOrLarger = windowWidth >= 768;

  const data = {
    labels: ["Out of Stock", "Available Stock"],
    datasets: [
      {
        data: [outOfStock, available],
        backgroundColor: ["#FF695B", "#22C55E"],
        hoverOffset: 4,
        borderRadius: 10,
        spacing: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: {
        display: !isMediumOrLarger,
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 15,
          color: darkMode ? "#F2F2F2" : "#000000", // legend label color
          generateLabels: (chart) => {
            const dataset = chart.data.datasets[0];
            return chart.data.labels.map((label, i) => {
              const value = dataset.data[i];
              const pct = ((value / total) * 100).toFixed(0);
              return {
                text: `${label} – ${pct}%`,
                fillStyle: dataset.backgroundColor[i],
              };
            });
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed;
            const pct = ((value / total) * 100).toFixed(0);
            return `${context.label}: ${pct}%`;
          },
        },
      },
    },
  };

  const externalLabelPlugin = {
    id: "externalLabels",
    afterDraw: (chart) => {
      if (!isMediumOrLarger) return;

      const { ctx, data } = chart;
      const meta = chart.getDatasetMeta(0);

      ctx.save();
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      meta.data.forEach((arc, i) => {
        const angle = (arc.startAngle + arc.endAngle) / 2;
        const xFrom = arc.x + Math.cos(angle) * arc.outerRadius;
        const yFrom = arc.y + Math.sin(angle) * arc.outerRadius;

        const lineLength = 20;
        const extraLine = 60;

        const xTo = arc.x + Math.cos(angle) * (arc.outerRadius + lineLength);
        const yTo = arc.y + Math.sin(angle) * (arc.outerRadius + lineLength);

        const xEnd = xTo + (Math.cos(angle) >= 0 ? extraLine : -extraLine);
        const yEnd = yTo;

        ctx.strokeStyle = "#CDCDCD";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(xFrom, yFrom);
        ctx.lineTo(xTo, yTo);
        ctx.lineTo(xEnd, yEnd);
        ctx.stroke();

        const value = data.datasets[0].data[i];
        const pct = ((value / total) * 100).toFixed(0);
        const alignRight = Math.cos(angle) >= 0;
        const textX = alignRight ? xEnd + 5 : xEnd - 5;

        ctx.textAlign = alignRight ? "left" : "right";
        ctx.fillStyle = data.datasets[0].backgroundColor[i];
        ctx.font = "bold 14px Arial";
        ctx.fillText(`${pct}%`, textX, yEnd - 8);

        ctx.fillStyle = darkMode ? "#F2F2F2" : "#000000"; // callout text color based on theme
        ctx.font = "12px Arial";
        ctx.fillText(data.labels[i], textX, yEnd + 8);
      });

      ctx.restore();
    },
  };

  const containerStyle = {
    position: "relative",
    width: "100%",
    maxWidth: "700px",
    height: isMediumOrLarger ? "300px" : "220px",
  };

  return (
    <div style={containerStyle}>
      <Doughnut
        key={darkMode ? "dark" : "light"} // force re-render on theme change
        ref={chartRef}
        data={data}
        options={options}
        plugins={[externalLabelPlugin]}
      />
    </div>
  );
};

export default DonutChart;
