import { CyclingInterface } from "./cycling";

export interface ReportInterface {
  _id: string;
  title: string;
  description: string;
  userId: string;
  cyclingId: CyclingInterface;
  status: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
