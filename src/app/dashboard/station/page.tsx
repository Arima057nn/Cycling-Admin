"use client";
import { StationInterface } from "@/interfaces/station";
import { stationApi } from "@/services/station-api";
import {
  Box,
  Button,
  Card,
  Checkbox,
  IconButton,
  InputAdornment,
  Modal,
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import { CyclingInterface } from "@/interfaces/cycling";
import { convertCyclingStatus } from "@/utils/CyclingStatus";
import { toast } from "react-toastify";
import CyclingStation from "@/components/cyclingStation/page";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: 640,
  bgcolor: "background.paper",
  borderRadius: 2,
  overflow: "auto",
  p: 4,
};

export default function Station() {
  const [stations, setStations] = useState<StationInterface[]>([]);
  const [filteredStations, setFilteredStations] = useState<StationInterface[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchAddress, setSearchAddress] = useState("");
  const [open, setOpen] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [stationChecked, setStationChecked] = useState<StationInterface | null>(
    null
  );
  const [selectedCyclings, setSelectedCyclings] = useState<
    { cyclingId: string }[]
  >([]);
  const [cyclings, setCyclings] = useState<CyclingInterface[]>([]);
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

  const handleShowAddCycling = (station: StationInterface) => {
    setStationChecked(station);
    setOpen(true);
  };

  const handleShowInfoStation = (station: StationInterface) => {
    setStationChecked(station);
    setOpenInfo(true);
  };
  const handleCloseModal = () => {
    setOpen(false);
    setStationChecked(null);
  };

  const handleCloseModalInfo = () => {
    setOpenInfo(false);
    setStationChecked(null);
  };
  const getCyclingsReady = async () => {
    const res = await stationApi.getCyclingsReady();
    if (res?.status === 200) {
      setCyclings(res.data.cyclingsNotAtStation);
    }
  };

  const createCyclingToStation = async () => {
    if (!stationChecked?._id) {
      toast.error("Chưa chọn trạm");
      return;
    }
    const res = await stationApi.createCyclingToStation(
      stationChecked?._id,
      selectedCyclings
    );
    if (res?.status === 200) {
      getCyclingsReady();
      toast.success("Thêm xe thành công");
    } else toast.error("Thêm xe thất bại");
  };

  useEffect(() => {
    getCyclingsReady();
  }, []);

  const handleCheckboxChange = (id: string) => {
    setSelectedCyclings((prevSelectedCyclings) => {
      if (prevSelectedCyclings.some((cycling) => cycling.cyclingId === id)) {
        return prevSelectedCyclings.filter(
          (cycling) => cycling.cyclingId !== id
        );
      } else {
        return [...prevSelectedCyclings, { cyclingId: id }];
      }
    });
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
                      <IconButton
                        color="primary"
                        onClick={() => {
                          router.push(`/dashboard/station/${row._id}`);
                        }}
                      >
                        <SettingsIcon />
                      </IconButton>
                      <IconButton
                        color="success"
                        onClick={() => handleShowAddCycling(row)}
                      >
                        <AddIcon />
                      </IconButton>
                      <IconButton onClick={() => handleShowInfoStation(row)}>
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
            <Modal
              open={open}
              onClose={handleCloseModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <div className="w-full h-full bg-white text-gray-700">
                  <div className="w-full flex justify-center items-center flex-col pb-4">
                    <div className="text-2xl font-semibold">
                      {stationChecked?.name}
                    </div>
                    <div className="text-sm font-medium text-blue-600 flex items-center gap-1">
                      <PlaceIcon /> {stationChecked?.position}
                    </div>
                  </div>
                  <div className="h-4/5 overflow-auto">
                    {cyclings.map((row) => (
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
                          <Typography variant="subtitle2">
                            {row.name}
                          </Typography>
                        </TableCell>
                        <TableCell>{row.code}</TableCell>
                        <TableCell>
                          {convertCyclingStatus(row.status)}
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={selectedCyclings.some(
                              (cycling) => cycling.cyclingId === row._id
                            )}
                            onChange={() => handleCheckboxChange(row._id)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </div>

                  <div className="w-full flex justify-end my-4">
                    <Button
                      variant="contained"
                      onClick={createCyclingToStation}
                    >
                      Thêm xe
                    </Button>
                  </div>
                </div>
              </Box>
            </Modal>
            <Modal
              open={openInfo}
              onClose={handleCloseModalInfo}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <CyclingStation station={stationChecked} />
              </Box>
            </Modal>
          </Box>
        </Card>
      </div>
    </div>
  );
}
