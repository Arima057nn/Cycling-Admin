"use client";

import { useEffect, useState } from "react";
import Chart from "@/components/chart";
import { statisticalApi } from "@/services/statistical-api";
import {
  peak10Interface,
  peakStationInterface,
  statisticalInterface,
} from "@/interfaces/statistical";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { SumStatistical } from "@/utils/SumStatistical";
import PieChart from "@/components/pieChart";
import BarChart from "@/components/barChart";
import { toast } from "react-toastify";

export default function Dashboard() {
  const now = new Date();
  const [dataBooking, setDataBookings] = useState<statisticalInterface[]>([]);
  const [dataRevenue, setDataRevenues] = useState<statisticalInterface[]>([]);
  const [peak, setPeaks] = useState<peak10Interface[]>([]);
  const [peakStation, setPeakStations] = useState<peakStationInterface[]>([]);
  const [selected, setSelected] = useState(3);
  const [month, setMonth] = useState((now.getMonth() + 1).toString());
  const [year, setYear] = useState(now.getFullYear().toString());
  const [open, setOpen] = useState(false);
  const [newUser, setNewUser] = useState(0);

  useEffect(() => {
    getCountBookingInMonthAndYear(month, year);
    getRevenueInMonthAndYear(month, year);
    getPeak10onMonthYear(month, year);
    getTopStationsInMonthAndYear(month, year);
    getNewUserInMonthAndYear(month, year);
  }, []);
  const handleSave = async () => {
    if (
      year &&
      (parseInt(year) < 2023 || parseInt(year) > new Date().getFullYear())
    ) {
      toast.error("Năm không hợp lệ");
      setOpen(false);
      return;
    }
    if (
      selected === 3 &&
      (!month || parseInt(month) < 1 || parseInt(month) > 12)
    ) {
      toast.error("Tháng không hợp lệ");
      setOpen(false);
      return;
    }
    if (selected === 3) {
      getCountBookingInMonthAndYear(month, year);
      getRevenueInMonthAndYear(month, year);
      getPeak10onMonthYear(month, year);
      getTopStationsInMonthAndYear(month, year);
      getNewUserInMonthAndYear(month, year);
    } else if (selected === 4) {
      getCountBookingInYear(year);
      getRevenueInYear(year);
      getPeak10onYear(year);
      getTopStationsInYear(year);
      getNewUserInYear(year);
    }
    setOpen(false);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const getCountBookingInMonthAndYear = async (month: string, year: string) => {
    const response = await statisticalApi.getCountBookingInMonthAndYear(
      month,
      year
    );
    if (response?.status === 200) setDataBookings(response.data?.bookings);
  };

  const getCountBookingInYear = async (year: string) => {
    const response = await statisticalApi.getCountBookingOnYear(year);
    if (response?.status === 200) setDataBookings(response.data?.bookings);
  };

  const getRevenueInMonthAndYear = async (month: string, year: string) => {
    const response = await statisticalApi.getRevenueInMonthAndYear(month, year);
    if (response?.status === 200) setDataRevenues(response?.data?.dailyRevenue);
  };

  const getRevenueInYear = async (year: string) => {
    const response = await statisticalApi.getRevenueOnYear(year);
    if (response?.status === 200)
      setDataRevenues(response.data?.monthlyRevenue);
  };

  const getPeak10onYear = async (year: string) => {
    const response = await statisticalApi.getPeak10onYear(year);
    if (response?.status === 200) setPeaks(response.data);
  };

  const getPeak10onMonthYear = async (month: string, year: string) => {
    const response = await statisticalApi.getPeak10onMonthYear(month, year);
    if (response?.status === 200) setPeaks(response.data);
  };

  const getTopStationsInYear = async (year: string) => {
    const response = await statisticalApi.getTopStationsInYear(year);
    if (response?.status === 200) setPeakStations(response.data);
  };

  const getTopStationsInMonthAndYear = async (month: string, year: string) => {
    const response = await statisticalApi.getTopStationsInMonthAndYear(
      month,
      year
    );
    if (response?.status === 200) setPeakStations(response.data);
  };

  const getNewUserInYear = async (year: string) => {
    const response = await statisticalApi.getNewUserInYear(year);
    if (response?.status === 200) setNewUser(response?.data.totalNewUsers);
  };

  const getNewUserInMonthAndYear = async (month: string, year: string) => {
    const response = await statisticalApi.getNewUserInMonthAndYear(month, year);
    if (response?.status === 200) setNewUser(response?.data.totalNewUsers);
  };
  return (
    <div className="p-4 w-full flex flex-col gap-4 items-center relative">
      <div className="text-2xl font-bold text-gray-700">
        Thống kế trong {selected === 3 && `tháng ${month}`} năm {year}
      </div>
      <div className="top-2 absolute right-4 bg-slate-50">
        <Select
          size="small"
          sx={{ width: 150 }}
          defaultValue={3}
          onChange={(event) => {
            if (event.target.value === 3 || event.target.value === 4) {
              setSelected(event.target.value as number);
              setOpen(true);
              return;
            }
          }}
        >
          <MenuItem value={3}>Theo tháng</MenuItem>
          <MenuItem value={4}>Theo năm</MenuItem>
        </Select>
      </div>
      <div className="flex w-full justify-center gap-4">
        <div className="p-4 bg-[#4B70F5] rounded-lg font-semibold flex text-gray-100 w-1/4 h-24 justify-between">
          <div>Doanh thu</div>
          <div>{SumStatistical(dataRevenue)} VNĐ</div>
        </div>
        <div className="p-4 bg-[#36BA98] rounded-lg font-semibold flex text-gray-100 w-1/4 h-24 justify-between">
          <div>Đặt xe</div>
          <div>{SumStatistical(dataBooking)}</div>
        </div>
        <div className="p-4 bg-[#F4A261] rounded-lg font-semibold flex text-gray-100 w-1/4 h-24 justify-between">
          <div>Vé</div>
          <div>1000</div>
        </div>
        <div className="p-4 bg-[#EE4E4E] rounded-lg font-semibold flex text-gray-100 w-1/4 h-24 justify-between">
          <div>Người dùng</div>
          <div>{newUser}</div>
        </div>
      </div>
      <div className="flex w-full justify-center gap-2">
        <div className="w-1/2 h-[360px] p-4 bg-white rounded-lg flex flex-col items-center justify-start">
          <Chart data={dataBooking} color="#F4A261" label="Chuyến đi" />
          <div className="text-gray-700 font-semibold text-xs pt-2">
            Thống kê số chuyến đi
          </div>
        </div>

        <div className="w-1/2 h-[360px] p-4 bg-white rounded-lg flex flex-col items-center justify-start">
          <Chart data={dataRevenue} color="#36BA98" label="Doanh thu" />
          <div className="text-gray-700 font-semibold text-xs pt-2">
            Thống kê doanh thu (VNĐ)
          </div>
        </div>
      </div>

      <div className="flex w-full justify-center gap-2">
        <div className="w-3/4 p-4 bg-white rounded-lg flex flex-col items-center">
          <BarChart datas={peakStation} />
          <div className="text-gray-700 font-semibold text-xs pt-2">
            10 trạm xe có lượng đặt xe nhiều nhất
          </div>
        </div>
        <div className="w-1/4 py-4 bg-white rounded-lg flex flex-col items-center justify-center">
          <PieChart datas={peak} />
          <div className="text-gray-700 font-semibold text-xs pt-2">
            10 khung giờ có nhiều chuyến đi nhất
          </div>
        </div>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Chọn Tháng và Năm</DialogTitle>
        <DialogContent>
          {selected === 3 && (
            <TextField
              label="Tháng"
              type="number"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              fullWidth
              margin="dense"
              inputProps={{ min: 1, max: 12 }}
            />
          )}
          <TextField
            label="Năm"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            fullWidth
            margin="dense"
            inputProps={{ min: 2023, max: new Date().getFullYear() }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSave} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
