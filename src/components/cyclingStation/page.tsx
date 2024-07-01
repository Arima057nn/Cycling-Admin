"use client";

import { CyclingAtStationInterface } from "@/interfaces/cycling";
import { StationInterface } from "@/interfaces/station";
import { stationApi } from "@/services/station-api";
import { convertCyclingStatus } from "@/utils/CyclingStatus";
import {
  Box,
  Button,
  Radio,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import PlaceIcon from "@mui/icons-material/Place";
import { toast } from "react-toastify";

const CyclingStation = ({ station }: { station: StationInterface | null }) => {
  const [cyclings, setCyclings] = useState<CyclingAtStationInterface[]>([]);
  const [selectedCyclingId, setSelectedCyclingId] = useState<string | null>(
    null
  );

  useEffect(() => {
    getCyclings();
  }, []);

  const getCyclings = async () => {
    let res = await stationApi.getCyclingsAtStation(station?._id);
    if (res?.status === 200) setCyclings(res?.data);
  };

  const handleRadioChange = (id: string) => {
    setSelectedCyclingId(id);
  };

  const handleDeleteCycling = async () => {
    if (station && selectedCyclingId) {
      const res = await stationApi.deleteCyclingFromStation(
        station?._id,
        selectedCyclingId
      );
      if (res?.status === 200) {
        getCyclings();
        toast.success(res.data.message);
      }
    }
  };
  return (
    <div className="w-full h-full bg-white text-gray-700">
      <div className="w-full flex justify-center items-center flex-col pb-4">
        <div className="text-2xl font-semibold">{station?.name}</div>
        <div className="text-sm font-medium text-blue-600 flex items-center gap-1">
          <PlaceIcon /> {station?.position}
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
              <Typography variant="subtitle2">{row.cyclingId.name}</Typography>
            </TableCell>
            <TableCell>{row.cyclingId.code}</TableCell>
            <TableCell>{row.cyclingId.category.name}</TableCell>
            <TableCell>{convertCyclingStatus(row.cyclingId.status)}</TableCell>
            <TableCell>
              <Radio
                checked={selectedCyclingId === row.cyclingId._id}
                onChange={() => handleRadioChange(row.cyclingId._id)}
              />
            </TableCell>
          </TableRow>
        ))}
      </div>
      <div className="w-full flex justify-end my-4">
        <Button variant="contained" onClick={() => handleDeleteCycling()}>
          Xóa xe
        </Button>
      </div>
    </div>
  );
};

export default CyclingStation;
