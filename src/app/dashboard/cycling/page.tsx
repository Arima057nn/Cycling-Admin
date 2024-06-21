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
  Button,
  IconButton,
  Modal,
} from "@mui/material";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { convertCyclingStatus } from "@/utils/CyclingStatus";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CYCLING_STATUS } from "@/constants/cycling";
import { reportApi } from "@/services/report-api";

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
export default function Station() {
  const [cyclings, setCyclings] = useState<CyclingInterface[]>([]);
  const [filteredCyclings, setFilteredCyclings] = useState<CyclingInterface[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [cyclingChecked, setCyclingChecked] = useState<CyclingInterface | null>(
    null
  );
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const getCyclings = async () => {
    const response = await cyclingApi.getAllCycling();
    if (response?.status === 200) {
      console.log(response.data);
      setCyclings(response.data);
      setFilteredCyclings(response.data);
    }
  };
  useEffect(() => {
    getCyclings();
  }, []);

  useEffect(() => {
    const filtered = cyclings.filter((cycling) =>
      cycling.name.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    setFilteredCyclings(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  }, [cyclings, itemsPerPage, searchKeyword]);

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
  const endIndex = Math.min(startIndex + itemsPerPage, filteredCyclings.length);
  const currentCyclings = filteredCyclings.slice(startIndex, endIndex);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchKeyword(event.target.value);
  };
  const handleOpenModal = (cycling: CyclingInterface) => {
    console.log("coord", cycling.latitude, cycling.longitude);
    if (cycling.latitude === undefined || cycling.longitude === undefined) {
      toast.error("Xe chưa được cài đặt vị trí");
      return;
    }
    let url = `https://www.google.com/maps/search/?api=1&query=${cycling.latitude},${cycling.longitude}`;
    window.open(url, "_blank");
  };

  const handleShowInfoStation = (cycling: CyclingInterface) => {
    setCyclingChecked(cycling);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setCyclingChecked(null);
  };

  const disabledCycling = async (cycling: CyclingInterface) => {
    setCyclingChecked(cycling);
    const res = await cyclingApi.disableCycling(cycling._id);
    if (res.status === 200) {
      toast.success(res.data.message);
      getCyclings();
    } else {
      toast.error(res.data.error);
    }
  };

  const enableCycling = async (cycling: CyclingInterface) => {
    setCyclingChecked(cycling);
    const res = await reportApi.finishMaintenance(cycling._id);
    if (res.status === 200) {
      toast.success("Kích hoạt xe thành công");
      getCyclings();
    } else {
      toast.error(res.data.error);
    }
  };

  return (
    <div className="p-4">
      <Card
        sx={{
          p: 2,
          color: "#1A1A1A",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <OutlinedInput
          defaultValue=""
          fullWidth
          placeholder="Lọc theo tên xe"
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
          sx={{ maxWidth: "500px" }}
          onChange={handleSearchInputChange}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            router.push("/dashboard/cycling/create");
          }}
        >
          Thêm xe{" "}
        </Button>
      </Card>
      <Card>
        <Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên xe</TableCell>
                <TableCell>Mã xe</TableCell>
                <TableCell>Loại</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>QR CODE</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(currentCyclings) &&
                currentCyclings.map((row) => (
                  <TableRow hover key={row._id}>
                    <TableCell
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Box
                        component="img"
                        alt="Widgets"
                        src="/assets/cycling.png"
                        sx={{
                          height: 64,
                          width: 64,
                          borderRadius: 2,
                        }}
                      />
                      <Typography variant="subtitle2">{row.name}</Typography>
                    </TableCell>
                    <TableCell>{row.code}</TableCell>
                    <TableCell>{row.category.name}</TableCell>
                    <TableCell>{convertCyclingStatus(row.status)}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleShowInfoStation(row)}
                      >
                        <QrCodeScannerIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleOpenModal(row)}
                        color="primary"
                      >
                        <MyLocationIcon />
                      </IconButton>
                      <IconButton color="primary">
                        <SettingsIcon />
                      </IconButton>
                      {row.status === CYCLING_STATUS.READY && (
                        <IconButton
                          color="error"
                          onClick={() => disabledCycling(row)}
                        >
                          <BlockIcon />
                        </IconButton>
                      )}
                      {row.status === CYCLING_STATUS.DISABLED && (
                        <IconButton
                          color="success"
                          onClick={() => enableCycling(row)}
                        >
                          <CheckCircleOutlineIcon />
                        </IconButton>
                      )}
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
          <Modal
            open={open}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <div className="w-full h-full bg-white text-gray-700">
                <Box
                  component="img"
                  alt="Widgets"
                  src={cyclingChecked?.qrcode}
                  sx={{
                    height: "auto",
                    width: 400,
                    borderRadius: 2,
                  }}
                />
              </div>
            </Box>
          </Modal>
        </Box>
      </Card>
    </div>
  );
}
