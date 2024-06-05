"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { cyclingApi } from "@/services/cycling-api";
import { CyclingTypeInterface } from "@/interfaces/cycling";
import { CYCLING_STATUS } from "@/constants/cycling";
import { toast } from "react-toastify";

export default function CreateCycling() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [category, setCategory] = useState("default"); // Set default value for category
  const [categories, setCategories] = useState<CyclingTypeInterface[]>([]);
  const getCategory = async () => {
    const res = await cyclingApi.getCategories();
    setCategories(res?.data);
  };

  const createCycling = async () => {
    const res = await cyclingApi.createCycling(
      name,
      code,
      category,
      CYCLING_STATUS.READY,
      "123456"
    );
    console.log(res);
    if (res?.status === 200) {
      setName("");
      setCode("");
      setCategory("default");
      toast.success("Create cycling successfully");
    } else toast.error("Create cycling failed");
  };

  useEffect(() => {
    getCategory();
  }, []);

  return (
    <div className="p-4">
      <Card sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>
          Create New Cycling
        </Typography>
        <Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Tên xe"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Mã xe"
              fullWidth
              margin="normal"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Select
              fullWidth
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              displayEmpty
              renderValue={(selected) =>
                selected && selected !== "default"
                  ? categories.find((cat) => cat._id === selected)?.name
                  : "Xe đạp"
              }
            >
              <MenuItem value="default" disabled>
                Loại xe
              </MenuItem>
              {categories.map((item) => (
                <MenuItem key={item._id} value={item._id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={createCycling}
          >
            Create
          </Button>
        </Box>
      </Card>
    </div>
  );
}
