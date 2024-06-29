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

const Chart = ({
  data,
  color,
  label,
}: {
  data: statisticalInterface[];
  color: string;
  label: string;
}) => {
  const chartData = {
    labels: data.map((entry) => entry.data),
    datasets: [
      {
        label: label,
        data: data.map((entry) => entry.count),
        fill: false,
        borderColor: color,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        // position: "top" as const,
        display: false,
      },
      title: {
        display: false,
        text: "Thống kê số lượng đặt xe",
      },
    },
    scales: {
      y: {
        type: "linear", // Specify the type of the y-axis
        min: 0, // Minimum value on the y-axis to prevent negative values
        ticks: {
          stepSize: 1, // Step size between values on the y-axis to ensure integers
          callback: function (value: number) {
            return value >= 0 && Number.isInteger(value) ? value : "";
          },
        },
      },
    },
  };

  return <Line data={chartData} options={options as any} />; // Use 'as any' to bypass type checking
};

export default Chart;
