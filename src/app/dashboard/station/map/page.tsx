"use client";

import CyclingStation from "@/components/cyclingStation/page";
import { StationInterface } from "@/interfaces/station";
import { stationApi } from "@/services/station-api";
import { Height, WidthFull } from "@mui/icons-material";
import { Box, Modal } from "@mui/material";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useCallback, useEffect, useState } from "react";

type Center = {
  lat: number;
  lng: number;
};

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

export default function Map() {
  const [center, setCenter] = useState<Center>();
  const [stations, setStations] = useState<StationInterface[]>([]);
  const [open, setOpen] = useState(false);
  const [stationChecked, setStationChecked] = useState<StationInterface | null>(
    null
  );
  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error accessing the GPS of the device:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const getLocation = useCallback(async () => {
    await getCurrentLocation();
  }, [getCurrentLocation]);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  const getStations = async () => {
    const response = await stationApi.getAllStation();
    if (response?.status === 200) {
      setStations(response.data);
    }
  };

  useEffect(() => {
    getStations();
  }, []);

  const handleShowInfoStation = (station: StationInterface) => {
    setStationChecked(station);
    setOpen(true);
    console.log(station);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setStationChecked(null);
  };
  return (
    <div>
      <div className="flex items-center justify-center h-screen">
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY as string}
        >
          <GoogleMap
            mapContainerStyle={{
              height: "100%",
              width: "100%",
            }}
            center={center}
            zoom={13}
          >
            {Array.isArray(stations) &&
              stations.map((station) => (
                <Marker
                  onClick={() => handleShowInfoStation(station)}
                  key={station._id}
                  position={{ lat: station.latitude, lng: station.longitude }}
                />
              ))}
          </GoogleMap>
        </LoadScript>
        <Modal
          open={open}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <CyclingStation station={stationChecked} />
          </Box>
        </Modal>
      </div>
    </div>
  );
}
