import { axiosClient } from "./axios-cilent";

export const stationApi = {
  getAllStation() {
    return axiosClient.get("/station");
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
};
