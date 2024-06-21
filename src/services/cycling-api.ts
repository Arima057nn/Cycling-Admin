import { create } from "domain";
import { axiosClient } from "./axios-cilent";

export const cyclingApi = {
  getAllCycling() {
    return axiosClient.get("/cycling");
  },
  getCategories() {
    return axiosClient.get("/cycling/type");
  },
  createCycling(
    name: string,
    code: string,
    category: string,
    status: number,
    password: string,
    qrcode: string
  ) {
    return axiosClient.post("/cycling/create", {
      name,
      code,
      category,
      status,
      password,
      qrcode,
    });
  },
  disableCycling(cyclingId: string) {
    return axiosClient.post("/cycling/disable", { cyclingId });
  },
};
