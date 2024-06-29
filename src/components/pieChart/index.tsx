"use client";

import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { peak10Interface } from "@/interfaces/statistical";

Chart.register(ArcElement, Tooltip, Legend);

const Colors = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#E76F51",
  "#36BA98",
  "#FFB4C2",
  "#729762",
  "#0F67B1",
  "#AF47D2",
  "#686D76",
];

const PieChart = ({ datas }: { datas: peak10Interface[] }) => {
  // Chuyển đổi dữ liệu từ sampleData sang cấu trúc cần thiết cho Chart.js
  const chartData = {
    labels: datas.map((item) => `${item._id}-${item._id + 1}h`),
    datasets: [
      {
        label: "Đặt xe", // Một chuỗi mô tả tập dữ liệu
        data: datas.map((item) => item.count),
        backgroundColor: Colors,
      },
    ],
  };

  return <Pie data={chartData} />;
};

export default PieChart;
