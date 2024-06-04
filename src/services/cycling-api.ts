import { axiosClient } from "./axios-cilent";

export const cyclingApi = {
  getAllCycling() {
    return axiosClient.get("/cycling");
  },
};
