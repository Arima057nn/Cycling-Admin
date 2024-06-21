import { axiosClient } from "./axios-cilent";

export const reportApi = {
  getReports() {
    return axiosClient.get("/report");
  },
};
