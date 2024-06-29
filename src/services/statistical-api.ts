import { axiosClient } from "./axios-cilent";

export const statisticalApi = {
  getCountBookingOnYear(year: string) {
    return axiosClient.get(`/statistical/booking/year?year=${year}`);
  },
  getCountBookingInMonthAndYear(month: string, year: string) {
    return axiosClient.get(
      `/statistical/booking/monthyear?month=${month}&year=${year}`
    );
  },
  getRevenueOnYear(year: string) {
    return axiosClient.get(`/statistical/revenue/year?year=${year}`);
  },
  getRevenueInMonthAndYear(month: string, year: string) {
    return axiosClient.get(
      `/statistical/revenue/monthyear?month=${month}&year=${year}`
    );
  },
  getPeak10onYear(year: string) {
    return axiosClient.get(`/statistical/booking/peak5Year?year=${year}`);
  },
  getPeak10onMonthYear(month: string, year: string) {
    return axiosClient.get(
      `/statistical/booking/peak5Month?month=${month}&year=${year}`
    );
  },

  getTopStationsInYear(year: string) {
    return axiosClient.get(`/statistical/station/topYear?year=${year}`);
  },
  getTopStationsInMonthAndYear(month: string, year: string) {
    return axiosClient.get(
      `/statistical/station/topMonth?month=${month}&year=${year}`
    );
  },

  getNewUserInYear(year: string) {
    return axiosClient.get(`/statistical/user/year?year=${year}`);
  },
  getNewUserInMonthAndYear(month: string, year: string) {
    return axiosClient.get(
      `/statistical/user/month?month=${month}&year=${year}`
    );
  },
};
