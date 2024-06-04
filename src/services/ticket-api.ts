import { axiosClient } from "./axios-cilent";

export const ticketApi = {
  getAllTicket() {
    return axiosClient.get("/ticket");
  },
};
