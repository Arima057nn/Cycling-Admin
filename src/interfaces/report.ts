import { CyclingInterface } from "./cycling";
import { UserLoggedInterface } from "./user";

export interface ReportInterface {
  _id: string;
  title: string;
  description: string;
  userId: UserLoggedInterface;
  cyclingId: CyclingInterface;
  status: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
