import { axiosClient } from "./axios-cilent";

export const reportApi = {
  getReports() {
    return axiosClient.get("/report");
  },
  changeStatus(reportId: string, status: number) {
    return axiosClient.post("/report/change", { reportId, status });
  },
  startMaintenance(cyclingId: string) {
    return axiosClient.post("/cycling/maintenance", { cyclingId });
  },
  finishMaintenance(cyclingId: string) {
    return axiosClient.post("/cycling/finish", { cyclingId });
  },
};
