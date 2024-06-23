"use client";

import { useEffect, useState } from "react";
import Chart from "@/components/chart";
import { statisticalApi } from "@/services/statistical-api";
import { statisticalInterface } from "@/interfaces/statistical";
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

export default function Dashboard() {
  const [data, setDatas] = useState<statisticalInterface[]>([]);
  const [selected, setSelected] = useState(1);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [open, setOpen] = useState(false);
  const getStatisticalBooking = async (status: number) => {
    if (status === 1) {
      const response = await statisticalApi.getCountBookingLast10Days(10);
      if (response?.status === 200) {
        setDatas(response.data);
      }
    } else if (status === 2) {
      const response = await statisticalApi.getCountBookingLast10Days(30);
      if (response?.status === 200) {
        setDatas(response.data);
      }
    }
  };
  useEffect(() => {
    getStatisticalBooking(1);
  }, []);
  const handleSave = async () => {
    if (selected === 3) {
      const response = await statisticalApi.getCountBookingInMonthAndYear(
        month,
        year
      );
      if (response?.status === 200) {
        setDatas(response.data);
      }
    }
    if (selected === 4) {
      const response = await statisticalApi.getCountBookingOnYear(year);
      if (response?.status === 200) {
        setDatas(response.data);
      }
    }
    setOpen(false);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="p-4 w-full h-screen flex flex-col">
      <div className="flex gap-2">
        <div className="flex gap-2 w-2/5 flex-wrap">
          <div className="p-4 w-1/2 rounded-lg bg-white text-red-500">hehe</div>

          <div className="p-4 w-1/2 rounded-lg bg-white text-red-500">hehe</div>

          <div className="p-4 w-1/2 rounded-lg bg-white text-red-500">hehe</div>

          <div className="p-4 w-1/2 rounded-lg bg-white text-red-500">hehe</div>
        </div>
        <div className="w-3/5 p-4 bg-white rounded-lg relative">
          <Chart data={data} />
          <div className="top-2 absolute right-4">
            <Select
              size="small"
              sx={{ width: 150 }}
              defaultValue={1}
              onChange={(event) => {
                if (event.target.value === 3 || event.target.value === 4) {
                  setSelected(event.target.value as number);
                  setOpen(true);
                  return;
                }
                {
                  getStatisticalBooking(event.target.value as number);
                }
              }}
            >
              <MenuItem value={1}>10 ngày qua</MenuItem>
              <MenuItem value={2}>30 ngày qua</MenuItem>
              <MenuItem value={3}>Theo tháng</MenuItem>
              <MenuItem value={4}>Theo năm</MenuItem>
            </Select>
          </div>
        </div>
      </div>
      <div className="w-full flex-1 mt-4 flex gap-4">
        <div className="flex-1 rounded-lg bg-white">hehe</div>
        <div className="flex-1 rounded-lg bg-white">hehe</div>
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
