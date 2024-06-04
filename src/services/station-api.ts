import { axiosClient } from "./axios-cilent";

export const stationApi = {
  getAllStation() {
    return axiosClient.get("/station");
  },
};
