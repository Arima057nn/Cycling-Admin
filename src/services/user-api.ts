import { axiosClient } from "./axios-cilent";

export const userApi = {
  getAllUser() {
    return axiosClient.get("/user");
  },
};
