"use client";

import { StationInterface } from "@/interfaces/station";
import { stationApi } from "@/services/station-api";
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
  const [stations, setStations] = useState<StationInterface[]>([]);
  const getStations = async () => {
    const response = await stationApi.getAllStation();
    if (response?.status === 200) {
      console.log(response.data);
      setStations(response.data);
    }
  };
  useEffect(() => {
    getStations();
  }, []);
  return (
    <div>
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
                  <TableCell>Tên trạm</TableCell>
                  <TableCell>Mã trạm</TableCell>
                  <TableCell>Địa chỉ</TableCell>
                  <TableCell>Tọa độ</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stations.map((row) => (
                  <TableRow hover key={row._id}>
                    <TableCell>
                      <Typography variant="subtitle2">{row.name}</Typography>
                    </TableCell>
                    <TableCell>{row.code}</TableCell>
                    <TableCell>{row.position}</TableCell>
                    <TableCell>
                      {row.latitude}, {row.longitude}
                    </TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Card>
      </div>
    </div>
  );
}
