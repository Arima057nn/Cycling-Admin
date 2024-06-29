"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { peakStationInterface } from "@/interfaces/statistical";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

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

const BarChart = ({ datas }: { datas: peakStationInterface[] }) => {
  const chartData = {
    labels: datas.map(
      (item) => `${item.station[0].code} - ${item.station[0].name}`
    ), // Chuyển `item._id` thành chuỗi
    datasets: [
      {
        label: "Đặt xe", // Một chuỗi mô tả tập dữ liệu
        data: datas.map((item) => item.count), // Mảng các giá trị đếm
        backgroundColor: Colors.slice(0, datas.length), // Giới hạn màu sắc theo số lượng dữ liệu
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        // position: "top", // Vị trí của legend
        display: false,
      },
      tooltip: {
        enabled: true, // Hiển thị tooltip
      },
    },
    scales: {
      x: {
        title: {
          display: false,
          text: "Mã trạm", // Tiêu đề trục x
        },
      },
      y: {
        title: {
          display: true,
          text: "Số lượng đặt xe", // Tiêu đề trục y
        },
        beginAtZero: true, // Bắt đầu trục y từ 0
      },
    },
  };

  return <Bar data={chartData} options={options as any} />;
};

export default BarChart;
