import { statisticalInterface } from "@/interfaces/statistical";

export function SumStatistical(statistical: statisticalInterface[]) {
  console.log("statistical", statistical);
  return statistical.reduce((sum, statistical) => sum + statistical.count, 0);
}
