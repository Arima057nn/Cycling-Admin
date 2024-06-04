import { axiosClient } from "./axios-cilent";

export const bookingApi = {
  getAllBooking() {
    return axiosClient.get("/booking");
  },
};
