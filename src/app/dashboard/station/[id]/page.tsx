"use client";

import { useEffect, useState } from "react";
import { Box, Button, Card, TextField, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { StationInterface } from "@/interfaces/station";
import { stationApi } from "@/services/station-api";

export default function Station({ params }: { params: { id: string } }) {
  const [station, setStation] = useState<StationInterface>();
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const getStation = async () => {
    const res = await stationApi.getStation(params.id);
    if (res.status === 200) {
      setStation(res.data);
      setLatitude(res.data.latitude.toString());
      setLongitude(res.data.longitude.toString());
    }
  };

  useEffect(() => {
    getStation();
  }, []);

  const updateStation = async () => {
    if (!station) return;
    const res = await stationApi.updateStation(
      station._id,
      station.name,
      station.position,
      latitude,
      longitude
    );
    if (res.status === 200) {
      toast.success("Cập nhật trạm xe thành công");
    } else {
      toast.error("Cập nhật trạm xe thất bại");
    }
  };
  return (
    <div className="p-4">
      <Card sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>
          Chỉnh sửa thông tin trạm xe
        </Typography>
        <Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <div className="flex-1">
              <div className="text-sm font-semibold">Tên trạm xe</div>
              <TextField
                fullWidth
                margin="normal"
                value={station?.name}
                onChange={(e) => {
                  station && setStation({ ...station, name: e.target.value });
                }}
              />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">Mã trạm</div>
              <TextField
                disabled
                fullWidth
                margin="normal"
                value={station?.code}
              />
            </div>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <div className="text-sm font-semibold">Địa chỉ</div>
            <TextField
              fullWidth
              margin="normal"
              value={station?.position}
              onChange={(e) => {
                station && setStation({ ...station, position: e.target.value });
              }}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <div className="flex-1">
              <div className="text-sm font-semibold">Kinh độ</div>

              <TextField
                fullWidth
                margin="normal"
                value={latitude}
                onChange={(e) => {
                  station && setLatitude(e.target.value);
                }}
              />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">Vĩ độ</div>
              <TextField
                fullWidth
                margin="normal"
                value={longitude}
                onChange={(e) => {
                  station && setLongitude(e.target.value);
                }}
              />
            </div>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={updateStation}
          >
            Cập nhật
          </Button>
        </Box>
      </Card>
    </div>
  );
}
