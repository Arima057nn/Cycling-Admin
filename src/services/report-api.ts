import { axiosClient } from "./axios-cilent";

export const reportApi = {
  getReports() {
    return axiosClient.get("/report");
  },
  changeStatus(reportId: string, status: number) {
    return axiosClient.post("/report/change", { reportId, status });
  },
};
