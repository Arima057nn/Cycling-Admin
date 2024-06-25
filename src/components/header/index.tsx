"use client";

import { Avatar, IconButton } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

const Header = () => {
  return (
    <div className="w-full bg-white border-b-2 border-gray-200 p-4 flex justify-end items-center">
      <IconButton aria-label="fingerprint">
        <NotificationsIcon />
      </IconButton>
      <div className="text-gray-600 px-2 font-bold text-xl">Admin</div>
      <Avatar sx={{ width: 42, height: 42, marginRight: 2 }} />
    </div>
  );
};

export default Header;
