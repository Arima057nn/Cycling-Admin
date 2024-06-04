"use client";

import { StationInterface } from "@/interfaces/station";
import { stationApi } from "@/services/station-api";
import { useEffect, useState } from "react";

export default function Cycling() {
  const [stations, setStations] = useState<StationInterface[]>([]);
  const getStations = async () => {
    const response = await stationApi.getAllStation();
    if (response.status === 200) {
      console.log(response.data);
      setStations(response.data);
    } else console.log("error", response.data.error);
  };
  useEffect(() => {
    getStations();
  }, []);
  return (
    <div>
      <div className="flex justify-between items-center"></div>
    </div>
  );
}
