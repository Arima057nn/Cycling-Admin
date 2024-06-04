"use client";

import { TripDetailInterface } from "@/interfaces/booking";
import { bookingApi } from "@/services/booking-api";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [bookings, setBookings] = useState<TripDetailInterface[]>([]);
  const getBookings = async () => {
    const response = await bookingApi.getAllBooking();
    if (response?.status === 200) {
      console.log(response.data);
      setBookings(response.data);
    }
  };
  useEffect(() => {
    getBookings();
  }, []);
  return (
    <div>
      <div className="flex justify-between items-center"></div>
    </div>
  );
}
