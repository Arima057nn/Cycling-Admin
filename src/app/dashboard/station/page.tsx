"use client";
import { StationInterface } from "@/interfaces/station";
import { stationApi } from "@/services/station-api";
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
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import PlaceIcon from "@mui/icons-material/Place";

export default function Station() {
  const [stations, setStations] = useState<StationInterface[]>([]);
  const [filteredStations, setFilteredStations] = useState<StationInterface[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchAddress, setSearchAddress] = useState("");
  const router = useRouter();
  const getStations = async () => {
    const response = await stationApi.getAllStation();
    if (response?.status === 200) {
      setStations(response.data);
      setFilteredStations(response.data);
    }
  };

  useEffect(() => {
    getStations();
  }, []);

  useEffect(() => {
    const filtered = stations.filter((station) =>
      station.position.toLowerCase().includes(searchAddress.toLowerCase())
    );
    setFilteredStations(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  }, [stations, itemsPerPage, searchAddress]);

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
  const endIndex = Math.min(startIndex + itemsPerPage, filteredStations.length);
  const currentStations = filteredStations.slice(startIndex, endIndex);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchAddress(event.target.value);
  };

  const handleCheckPosition = () => {
    router.push(`/dashboard/station/map/`);
  };
  return (
    <div>
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
            placeholder="Tìm kiếm theo địa chỉ"
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
            sx={{ maxWidth: "500px" }}
            onChange={handleSearchInputChange}
          />
          <div>
            <Button
              variant="contained"
              color="success"
              endIcon={<PlaceIcon />}
              sx={{ marginRight: 2 }}
              onClick={() => handleCheckPosition()}
            >
              Map
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                router.push("/dashboard/station/create");
              }}
            >
              Thêm trạm
            </Button>
          </div>
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
                {currentStations.map((row) => (
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
                        src={row.imgae}
                        sx={{
                          height: 64,
                          width: 84,
                          borderRadius: 2,
                        }}
                      />
                      <Typography variant="subtitle2">{row.name}</Typography>
                    </TableCell>
                    <TableCell>{row.code}</TableCell>
                    <TableCell>{row.position}</TableCell>
                    <TableCell>
                      {row.latitude}, {row.longitude}
                    </TableCell>
                    <TableCell>
                      <IconButton color="primary">
                        <SettingsIcon />
                      </IconButton>
                      <IconButton color="error">
                        <DeleteIcon />
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
    </div>
  );
}
