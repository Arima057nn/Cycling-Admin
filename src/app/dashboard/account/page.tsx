"use client";

import { UserLoggedInterface } from "@/interfaces/user";
import { userApi } from "@/services/user-api";
import { useEffect, useState } from "react";

export default function Account() {
  const [users, setUsers] = useState<UserLoggedInterface[]>([]);
  const getUsers = async () => {
    const response = await userApi.getAllUser();
    if (response.status === 200) {
      console.log(response.data);
      setUsers(response.data);
    } else console.log("error", response.data.error);
  };
  useEffect(() => {
    getUsers();
  }, []);
  return (
    <div>
      <div className="flex justify-between items-center"></div>
    </div>
  );
}
