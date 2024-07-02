"use client";

import { TicketInterface } from "@/interfaces/ticket";
import { ticketApi } from "@/services/ticket-api";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  IconButton,
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useRouter } from "next/navigation";

export default function Ticket() {
  const [tickets, setTickets] = useState<TicketInterface[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<TicketInterface[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchName, setSearchName] = useState("");
  const router = useRouter();

  const getTickets = async () => {
    const response = await ticketApi.getAllTicket();
    if (response?.status === 200) {
      console.log(response.data);
      setTickets(response.data);
      setFilteredTickets(response.data);
    }
  };

  useEffect(() => {
    getTickets();
  }, []);

  useEffect(() => {
    const filtered = tickets.filter((ticket) =>
      ticket.name.toLowerCase().includes(searchName.toLowerCase())
    );
    setFilteredTickets(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  }, [tickets, itemsPerPage, searchName]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredTickets.length);
  const currentTickets = filteredTickets.slice(startIndex, endIndex);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchName(event.target.value);
  };

  return (
    <div className="p-4">
      <Card sx={{ p: 2 }}>
        <OutlinedInput
          defaultValue=""
          fullWidth
          placeholder="Tìm kiếm loại vé"
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
          sx={{ maxWidth: "500px" }}
          onChange={handleSearchInputChange}
        />
      </Card>
      <Card>
        <Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Loại vé</TableCell>
                <TableCell>Loại xe</TableCell>
                <TableCell>Giá</TableCell>
                <TableCell>Thời gian sử dụng</TableCell>
                <TableCell>Hạn sử dụng</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentTickets.map((row) => (
                <TableRow hover key={row._id}>
                  <TableCell>
                    <Typography variant="subtitle2">{row.name}</Typography>
                  </TableCell>
                  <TableCell>{row.categoryId.name}</TableCell>
                  <TableCell>{row.price}</TableCell>
                  <TableCell>{row.timer} phút</TableCell>
                  <TableCell>{row.expiration} giờ</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => {
                        router.push(`/dashboard/ticket/${row._id}`);
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box display="flex" justifyContent="center" padding={4}>
            <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                style={{
                  margin: "0 4px",
                  backgroundColor:
                    index + 1 === currentPage ? "#836FFF" : "white",
                  color: index + 1 === currentPage ? "white" : "black",
                  border: "1px solid #ccc",
                  cursor: "pointer",
                  borderRadius: 4,
                  fontSize: 16,
                  textAlign: "center",
                  width: 24,
                }}
              >
                {index + 1}
              </button>
            ))}
            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Card>
    </div>
  );
}
