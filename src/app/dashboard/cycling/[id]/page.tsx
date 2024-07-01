"use client";

import { useEffect, useState } from "react";
import { Box, Button, Card, TextField, Typography } from "@mui/material";
import { cyclingApi } from "@/services/cycling-api";
import { CyclingInterface } from "@/interfaces/cycling";
import { toast } from "react-toastify";

export default function Cycling({ params }: { params: { id: string } }) {
  const [cycling, setCycling] = useState<CyclingInterface>();

  const updateCycling = async () => {
    if (!cycling) return;
    const res = await cyclingApi.updateCycling(params.id, cycling?.name);
    console.log("res", res);
    if (res?.status === 200) {
      toast.success(res.data.message);
    } else {
      toast.error(res.data.error);
    }
  };

  const getCycling = async () => {
    const res = await cyclingApi.getCycling(params.id);
    if (res.status === 200) {
      setCycling(res.data);
    }
  };
  useEffect(() => {
    getCycling();
  }, []);
  return (
    <div className="p-4">
      <Card sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>
          Chỉnh sửa thông tin xe
        </Typography>
        <Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              value={cycling?.name}
              onChange={(e) =>
                cycling && setCycling({ ...cycling, name: e.target.value })
              }
            />
            <TextField fullWidth margin="normal" value={cycling?.code} />
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={updateCycling}
          >
            Cập nhật
          </Button>
        </Box>
      </Card>
    </div>
  );
}
