"use client";

import { useEffect, useState } from "react";
import { Box, Button, Card, TextField, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { TicketInterface } from "@/interfaces/ticket";
import { ticketApi } from "@/services/ticket-api";

export default function Ticket({ params }: { params: { id: string } }) {
  const [ticket, setTicket] = useState<TicketInterface>();

  const getTicket = async () => {
    const res = await ticketApi.getTicketById(params.id);
    if (res?.status === 200) {
      setTicket(res.data);
    }
  };

  useEffect(() => {
    getTicket();
  }, []);

  const updateTicket = async () => {
    if (!ticket) return;
    const res = await ticketApi.updateTicket(
      ticket._id,
      ticket.name,
      ticket.price,
      ticket.expiration,
      ticket.timer,
      ticket.overduePrice
    );
    if (res?.status === 200) {
      toast.success("Cập nhật vé thành công");
      getTicket();
    } else toast.error("Cập nhật vé thất bại");
  };
  return (
    <div className="p-4">
      <Card sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>
          Thông tin vé
        </Typography>
        <Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <div className="flex-1">
              <div className="text-sm font-semibold mb-2 mt-4">Tên vé</div>
              <TextField fullWidth value={ticket?.name} disabled />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold mb-2 mt-4">
                Hạn sử dụng (giờ)
              </div>
              <TextField
                fullWidth
                value={ticket?.expiration}
                onChange={(e) => {
                  ticket &&
                    setTicket({ ...ticket, expiration: e.target.value as any });
                }}
              />
            </div>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <div className="flex-1">
              <div className="text-sm font-semibold mb-2 mt-4">
                Giá vé (điểm)
              </div>
              <TextField
                fullWidth
                value={ticket?.price}
                onChange={(e) => {
                  ticket &&
                    setTicket({ ...ticket, price: e.target.value as any });
                }}
              />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold mb-2 mt-4">
                Thời gian sử dụng (phút)
              </div>
              <TextField
                fullWidth
                value={ticket?.timer}
                onChange={(e) => {
                  ticket &&
                    setTicket({ ...ticket, timer: e.target.value as any });
                }}
              />
            </div>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <div className="flex-1">
              <div className="text-sm font-semibold mb-2 mt-4">
                Giá vượt mức sử dụng (điểm)
              </div>
              <TextField
                fullWidth
                value={ticket?.overduePrice}
                onChange={(e) => {
                  ticket &&
                    setTicket({
                      ...ticket,
                      overduePrice: e.target.value as any,
                    });
                }}
              />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold mb-2 mt-4">
                Thời gian tính phí khi vượt mức (phút)
              </div>
              <TextField
                fullWidth
                value={ticket?.duration}
                onChange={(e) => {
                  ticket &&
                    setTicket({ ...ticket, duration: e.target.value as any });
                }}
              />
            </div>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <div className="flex-1">
              <div className="text-sm font-semibold mb-2 mt-4">Loại vé</div>
              <TextField disabled fullWidth value={ticket?.type.name} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold mb-2 mt-4">Loại xe</div>
              <TextField disabled fullWidth value={ticket?.categoryId.name} />
            </div>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={updateTicket}
          >
            Cập nhật
          </Button>
        </Box>
      </Card>
    </div>
  );
}
