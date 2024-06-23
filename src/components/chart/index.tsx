"use client";

import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { statisticalInterface } from "@/interfaces/statistical";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Chart = ({ data }: { data: statisticalInterface[] }) => {
  const chartData = {
    labels: data.map((entry) => entry.date),
    datasets: [
      {
        label: "Dataset",
        data: data.map((entry) => entry.count),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Thống kê số lượng đặt xe",
      },
    },
    cales: {
      y: {
        min: 0, // minimum value on the y-axis
        max: 10, // maximum value on the y-axis
        ticks: {
          stepSize: 1, // step size between values on the y-axis
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default Chart;
