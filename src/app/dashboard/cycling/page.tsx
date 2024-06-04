"use client";

import { CyclingInterface } from "@/interfaces/cycling";
import { cyclingApi } from "@/services/cycling-api";
import {
  Box,
  Card,
  InputAdornment,
  OutlinedInput,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

export default function Station() {
  const [cyclings, setCyclings] = useState<CyclingInterface[]>([]);
  const getCyclings = async () => {
    const response = await cyclingApi.getAllCycling();
    if (response?.status === 200) {
      console.log(response.data);
      setCyclings(response.data);
    }
  };
  useEffect(() => {
    getCyclings();
  }, []);
  return (
    <div className="p-4">
      <Card sx={{ p: 2 }}>
        <OutlinedInput
          defaultValue=""
          fullWidth
          placeholder="Search customer"
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
          sx={{ maxWidth: "500px" }}
        />
      </Card>
      <Card>
        <Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên xe</TableCell>
                <TableCell>Mã xe</TableCell>
                <TableCell>Loại</TableCell>
                <TableCell>Ví trí hiện tại</TableCell>
                <TableCell>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cyclings.map((row) => (
                <TableRow hover key={row._id}>
                  <TableCell>
                    <Typography variant="subtitle2">{row.name}</Typography>
                  </TableCell>
                  <TableCell>{row.code}</TableCell>
                  <TableCell>{row.category.name}</TableCell>
                  <TableCell>
                    {row.latitude}, {row.longitude}
                  </TableCell>
                  <TableCell>{row.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Card>
    </div>
  );
}
