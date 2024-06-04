"use client";

import { TicketInterface } from "@/interfaces/ticket";
import { ticketApi } from "@/services/ticket-api";
import { useEffect, useState } from "react";

export default function Ticket() {
  const [tickets, setTickets] = useState<TicketInterface[]>([]);
  const getTickets = async () => {
    const response = await ticketApi.getAllTicket();
    if (response.status === 200) {
      console.log(response.data);
      setTickets(response.data);
    } else console.log("error", response.data.error);
  };
  useEffect(() => {
    getTickets();
  }, []);
  return (
    <div>
      <div className="flex justify-between items-center"></div>
    </div>
  );
}
