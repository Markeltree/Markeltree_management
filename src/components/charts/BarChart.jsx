import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useTheme } from "../../context/ThemeContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const BarChart = ({ dataPoints }) => {
  const { darkMode } = useTheme();

  // Responsive bar thickness and container height
  const [barThickness, setBarThickness] = useState(45);
  const [containerHeight, setContainerHeight] = useState(400);

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth < 480) {
        setBarThickness(20);
        setContainerHeight(300);
      } else if (window.innerWidth < 768) {
        setBarThickness(30);
        setContainerHeight(300);
      } else {
        setBarThickness(45);
        setContainerHeight(300);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const getGradient = (ctx, chartArea, urgency) => {
    const gradient = ctx.createLinearGradient(
      0,
      chartArea.bottom,
      0,
      chartArea.top
    );
    if (urgency >= 70) {
      gradient.addColorStop(0, "#FF695B");
      gradient.addColorStop(1, "#BC0A0D");
    } else if (urgency >= 40) {
      gradient.addColorStop(0, "#DDD427");
      gradient.addColorStop(1, "#CA7611");
    } else {
      gradient.addColorStop(0, "#22C55E");
      gradient.addColorStop(1, "#8EFF37");
    }
    return gradient;
  };

  // Chart data
  const chartData = {
    labels: dataPoints.map((d) => d.product),
    datasets: [
      {
        label: "Urgency Level (%)",
        data: dataPoints.map((d) => d.urgency),
        backgroundColor: (context) => {
          const { ctx, chartArea } = context.chart;
          if (!chartArea) return null;
          const value = context.dataset.data[context.dataIndex];
          return getGradient(ctx, chartArea, value);
        },
        borderRadius: 8,
        borderSkipped: false,
        barThickness,
      },
    ],
  };

  // Chart options with darkMode support
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          display: false, // if you want to hide grid lines (horizontal lines)
          drawBorder: false, // controls axis line visibility
          borderColor: darkMode ? "#FFFFFF" : "#000000", // axis line color
          color: darkMode ? "000000" : "#FFFFFF", // grid lines color
        },
        ticks: {
          color: darkMode ? "#ffffff" : "#737791",
          font: { size: 10, weight: "normal" },
          callback: (val) => val + "%",
        },
        title: {
          display: false,
          color: darkMode ? "#ffffff" : "#737791",
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
          borderColor: darkMode ? "#FFFFFF" : "#000000", // axis line color
          color: darkMode ? "000000" : "#FFFFFF",
        },
        ticks: {
          color: darkMode ? "#ffffff" : "#737791",
          font: { size: 10, weight: "normal" },
        },
        title: {
          display: false,
          color: darkMode ? "#ffffff" : "#737791",
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.y}%`,
        },
      },
    },
  };

  // Use a key based on darkMode to force remount & re-render on theme change
  return (
    <div
      key={darkMode ? "dark" : "light"}
      style={{
        width: "100%",
        maxWidth: 900,
        height: containerHeight,
        margin: "0 auto",
        backgroundColor: darkMode ? "#000" : "#fff", // Optional: helps test visibility
      }}
    >
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;
