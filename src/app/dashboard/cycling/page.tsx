"use client";

import { CyclingInterface } from "@/interfaces/cycling";
import { cyclingApi } from "@/services/cycling-api";
import { useEffect, useState } from "react";

export default function Station() {
  const [cyclings, setCyclings] = useState<CyclingInterface[]>([]);
  const getCyclings = async () => {
    const response = await cyclingApi.getAllCycling();
    if (response.status === 200) {
      console.log(response.data);
      setCyclings(response.data);
    } else console.log("error", response.data.error);
  };
  useEffect(() => {
    getCyclings();
  }, []);
  return (
    <div>
      <div className="flex justify-between items-center"></div>
    </div>
  );
}
