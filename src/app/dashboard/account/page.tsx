"use client";

import { UserLoggedInterface } from "@/interfaces/user";
import { userApi } from "@/services/user-api";
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

export default function Account() {
  const [users, setUsers] = useState<UserLoggedInterface[]>([]);
  const getUsers = async () => {
    const response = await userApi.getAllUser();
    if (response?.status === 200) {
      console.log(response.data);
      setUsers(response.data);
    }
  };
  useEffect(() => {
    getUsers();
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
                <TableCell>Tên người dùng</TableCell>
                <TableCell>UID</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Tài khoản</TableCell>
                <TableCell>Điểm tích lũy</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((row) => (
                <TableRow hover key={row._id}>
                  <TableCell>
                    <Typography variant="subtitle2">{row.name}</Typography>
                  </TableCell>
                  <TableCell>{row.uid}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.balance}</TableCell>
                  <TableCell>{row.point}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Card>
    </div>
  );
}
