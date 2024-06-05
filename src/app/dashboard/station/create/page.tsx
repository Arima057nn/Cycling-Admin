"use client";

import { useEffect, useState } from "react";
import { Box, Button, Card, TextField, Typography } from "@mui/material";
import { stationApi } from "@/services/station-api"; // Assuming you have this service
import { toast } from "react-toastify";

export default function CreateStation() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [position, setPosition] = useState("");

  const createStation = async () => {
    const res = await stationApi.createStation(
      name,
      code,
      position,
      latitude,
      longitude
    );
    console.log(res);
    if (res?.status === 200) {
      setName("");
      setCode("");
      setLatitude("");
      setLongitude("");
      setPosition("");
      toast.success("Create station successfully");
    } else toast.error("Create station failed");
  };

  return (
    <div className="p-4">
      <Card sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>
          Create New Station
        </Typography>
        <Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Tên trạm"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Mã trạm"
              fullWidth
              margin="normal"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Địa chỉ cụ thể"
              fullWidth
              margin="normal"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Vĩ độ"
              fullWidth
              margin="normal"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
            <TextField
              label="Kinh độ"
              fullWidth
              margin="normal"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={createStation}
          >
            Create
          </Button>
        </Box>
      </Card>
    </div>
  );
}
