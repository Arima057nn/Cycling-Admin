"use client";

import { TicketInterface } from "@/interfaces/ticket";
import { ticketApi } from "@/services/ticket-api";
import { useEffect, useState } from "react";
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
import SearchIcon from "@mui/icons-material/Search";

export default function Ticket() {
  const [tickets, setTickets] = useState<TicketInterface[]>([]);
  const getTickets = async () => {
    const response = await ticketApi.getAllTicket();
    if (response?.status === 200) {
      console.log(response.data);
      setTickets(response.data);
    }
  };
  useEffect(() => {
    getTickets();
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
                <TableCell>Tên vé</TableCell>
                <TableCell>Loại xe</TableCell>
                <TableCell>Giá</TableCell>
                <TableCell>Thời gian sử dụng</TableCell>
                <TableCell>Hạn sử dụng</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.map((row) => (
                <TableRow hover key={row._id}>
                  <TableCell>
                    <Typography variant="subtitle2">{row.name}</Typography>
                  </TableCell>
                  <TableCell>{row.categoryId.name}</TableCell>
                  <TableCell>{row.price}</TableCell>
                  <TableCell>{row.timer} phút</TableCell>
                  <TableCell>{row.expiration} giờ</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Card>
    </div>
  );
}
