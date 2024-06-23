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
  Select,
  MenuItem,
  IconButton,
  Modal,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BuildIcon from "@mui/icons-material/Build";
import SearchIcon from "@mui/icons-material/Search";
import { ReportInterface } from "@/interfaces/report";
import { reportApi } from "@/services/report-api";
import { REPORT_STATUS } from "@/constants/report";
import { convertCyclingStatus } from "@/utils/CyclingStatus";
import { toast } from "react-toastify";
import { CYCLING_STATUS } from "@/constants/cycling";
import CheckIcon from "@mui/icons-material/Check";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: 600,
  bgcolor: "background.paper",
  borderRadius: 2,
  overflow: "auto",
  p: 4,
};

export default function Report() {
  const [reports, setReports] = useState<ReportInterface[]>([]);
  const [filteredReports, setFilteredReports] = useState<ReportInterface[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [open, setOpen] = useState(false);
  const [reportChecked, setReportChecked] = useState<ReportInterface | null>(
    null
  );
  const getReports = async () => {
    const response = await reportApi.getReports();
    if (response?.status === 200) {
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

  const handleStatusChange = async (reportId: string, newStatus: number) => {
    try {
      const res = await reportApi.changeStatus(reportId, newStatus);
      setReports((prevReports) =>
        prevReports.map((report) =>
          report._id === reportId ? { ...report, status: newStatus } : report
        )
      );
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleShowInfoReport = (report: ReportInterface) => {
    setReportChecked(report);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setReportChecked(null);
  };

  const startMaintenance = async (report: ReportInterface) => {
    setReportChecked(report);
    const res = await reportApi.startMaintenance(report.cyclingId._id);
    if (res?.status === 200) {
      toast.success(res.data.message);
    } else {
      toast.error(res.data.error);
    }
  };

  const handleFinishMaintenance = async (report: ReportInterface) => {
    setReportChecked(report);
    const res = await reportApi.finishMaintenance(report.cyclingId._id);
    if (res?.status === 200) {
      toast.success(res.data.message);
    } else {
      toast.error(res.data.error);
    }
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
                <TableCell>Người dùng</TableCell>
                <TableCell>Xe đạp</TableCell>
                <TableCell>Chi tiết</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Trạng thái xe</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentReports.map((row) => (
                <TableRow hover key={row._id}>
                  <TableCell>
                    <Typography variant="subtitle2">{row.title}</Typography>
                  </TableCell>
                  <TableCell>{row.userId._id}</TableCell>
                  <TableCell>{row?.cyclingId?.name}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        handleShowInfoReport(row);
                      }}
                      color="primary"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      value={row.status}
                      onChange={(event) =>
                        handleStatusChange(
                          row._id,
                          event.target.value as number
                        )
                      }
                    >
                      {REPORT_STATUS.map((status) => (
                        <MenuItem key={status.value} value={status.value}>
                          {status.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  {row.status === REPORT_STATUS[2].value ? (
                    <TableCell></TableCell>
                  ) : (
                    <TableCell>
                      {row.cyclingId &&
                        convertCyclingStatus(row.cyclingId.status)}
                      {row.cyclingId &&
                        row.cyclingId.status !== CYCLING_STATUS.MAINTENANCE && (
                          <IconButton
                            onClick={() => {
                              startMaintenance(row);
                            }}
                            color="error"
                          >
                            <BuildIcon />
                          </IconButton>
                        )}
                      {row.cyclingId &&
                        row.cyclingId.status === CYCLING_STATUS.MAINTENANCE && (
                          <IconButton
                            onClick={() => {
                              handleFinishMaintenance(row);
                            }}
                            color="success"
                          >
                            <CheckIcon />
                          </IconButton>
                        )}
                    </TableCell>
                  )}
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
          <Modal
            open={open}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <div className="w-96 h-full bg-white text-gray-700">
                {reportChecked && (
                  <Box>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {reportChecked.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      gutterBottom
                      sx={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      <strong>Mô tả:</strong> {reportChecked.description}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Mã người dùng:</strong> {reportChecked.userId._id}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Người dùng:</strong> {reportChecked.userId.name}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Xe đạp:</strong> {reportChecked.cyclingId?.name}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Trạng thái:</strong>{" "}
                      {
                        REPORT_STATUS.find(
                          (status) => status.value === reportChecked.status
                        )?.title
                      }
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Ngày tạo:</strong>{" "}
                      {new Date(reportChecked.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                )}
              </div>
            </Box>
          </Modal>
        </Box>
      </Card>
    </div>
  );
}
