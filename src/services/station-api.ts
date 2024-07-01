import { axiosClient } from "./axios-cilent";

export const stationApi = {
  getAllStation() {
    return axiosClient.get("/station");
  },
  getStation(stationId: string) {
    return axiosClient.get(`/station/id?stationId=${stationId}`);
  },
  updateStation(
    stationId: string,
    name: string,
    position: string,
    latitude: string,
    longitude: string
  ) {
    return axiosClient.post("/station/update", {
      stationId,
      name,
      position,
      latitude,
      longitude,
    });
  },
  createStation(
    name: string,
    code: string,
    position: string,
    latitude: string,
    longitude: string,
    image: string
  ) {
    return axiosClient.post("/station/create", {
      name,
      code,
      position,
      latitude,
      longitude,
      image,
    });
  },
  getCyclingsAtStation(stationId: string | undefined) {
    return axiosClient.get(`/station/info?stationId=${stationId}`);
  },
  getCyclingsReady() {
    return axiosClient.get("/station/cyclingReady");
  },
  createCyclingToStation(stationId: string, cyclings: { cyclingId: string }[]) {
    return axiosClient.post("/station/createCyclings", { stationId, cyclings });
  },
  deleteCyclingFromStation(stationId: string, cyclingId: string) {
    return axiosClient.post(`/station/deleteCycling`, { stationId, cyclingId });
  },
};
