import { axiosClient } from "./axios-cilent";

export const statisticalApi = {
    getCountBookingLast10Days(day: number) {
        return axiosClient.get(`/statistical/booking/last10day?day=${day}`);
    },
    getCountBookingOnYear(year: string) {
        return axiosClient.get(`/statistical/booking/year?year=${year}`);
    },
    getCountBookingInMonthAndYear(month: string, year: string) {
        return axiosClient.get(`/statistical/booking/monthyear?month=${month}&year=${year}`);
    },
};
