"use client";

import { CyclingAtStationInterface } from "@/interfaces/cycling";
import { StationInterface } from "@/interfaces/station";
import { stationApi } from "@/services/station-api";
import { convertCyclingStatus } from "@/utils/CyclingStatus";
import { Box, TableCell, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import PlaceIcon from "@mui/icons-material/Place";

const CyclingStation = ({ station }: { station: StationInterface | null }) => {
  const [cyclings, setCyclings] = useState<CyclingAtStationInterface[]>([]);
  useEffect(() => {
    getCyclings();
  }, []);

  const getCyclings = async () => {
    let res = await stationApi.getCyclingsAtStation(station?._id);
    if (res?.status === 200) setCyclings(res?.data);
  };
  return (
    <div className="w-full h-full bg-white text-gray-700">
      <div className="w-full flex justify-center items-center flex-col pb-4">
        <div className="text-2xl font-semibold">{station?.name}</div>
        <div className="text-sm font-medium text-blue-600 flex items-center gap-1">
          <PlaceIcon /> {station?.position}
        </div>
      </div>
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
        </TableRow>
      ))}
    </div>
  );
};

export default CyclingStation;
