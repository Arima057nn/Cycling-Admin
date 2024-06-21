import { CYCLING_STATUS } from "@/constants/cycling";

export function convertCyclingStatus(status: number): string {
  switch (status) {
    case CYCLING_STATUS.READY:
      return "Sẵn sàng";
    case CYCLING_STATUS.ACTIVE:
      return "Hoạt động";
    case CYCLING_STATUS.KEEPING:
      return "Giữ xe";
    case CYCLING_STATUS.MAINTENANCE:
      return "Bảo dưỡng";
    default:
      return "Không xác định";
  }
}
