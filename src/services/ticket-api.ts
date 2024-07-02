import { axiosClient } from "./axios-cilent";

export const ticketApi = {
  getAllTicket() {
    return axiosClient.get("/ticket");
  },
  getTicketById(id: string) {
    return axiosClient.get(`/ticket/id?id=${id}`);
  },
  updateTicket(
    ticketId: string,
    name: string,
    price: number,
    expiration: number,
    timer: number,
    overduePrice: number
  ) {
    return axiosClient.post(`/ticket/update`, {
      ticketId,
      name,
      price,
      expiration,
      timer,
      overduePrice,
    });
  },
};
