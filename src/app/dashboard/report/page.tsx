"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
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
import { ReportInterface } from "@/interfaces/report";
import { reportApi } from "@/services/report-api";

export default function Report() {
  const [reports, setReports] = useState<ReportInterface[]>([]);
  const [filteredReports, setFilteredReports] = useState<ReportInterface[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchName, setSearchName] = useState("");

  const getReports = async () => {
    const response = await reportApi.getReports();
    if (response?.status === 200) {
      console.log(response.data);
      setReports(response.data);
      setFilteredReports(response.data);
    }
  };

  useEffect(() => {
    getReports();
  }, []);

  useEffect(() => {
    const filtered = reports.filter((report) =>
      report.title.toLowerCase().includes(searchName.toLowerCase())
    );
    setFilteredReports(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  }, [reports, itemsPerPage, searchName]);

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
  const endIndex = Math.min(startIndex + itemsPerPage, filteredReports.length);
  const currentReports = filteredReports.slice(startIndex, endIndex);

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
                <TableCell>Sự cố</TableCell>
                <TableCell>Chi tiết</TableCell>
                <TableCell>Người dùng</TableCell>
                <TableCell>Xe đạp</TableCell>
                <TableCell>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentReports.map((row) => (
                <TableRow hover key={row._id}>
                  <TableCell>
                    <Typography variant="subtitle2">{row.title}</Typography>
                  </TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{row.userId}</TableCell>
                  <TableCell>{row.cyclingId.name}</TableCell>
                  <TableCell>{row.status}</TableCell>
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
