"use client";

import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import BarChartIcon from "@mui/icons-material/BarChart";
import LogoutIcon from "@mui/icons-material/Logout";
import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "@/contexts/authContext";
import { toast } from "react-toastify";
import { Box } from "@mui/material";

const Sidebar = () => {
  const { dispatch } = useContext(UserContext);

  const handleLogout = async () => {
    dispatch && dispatch({ type: "LOGOUT" });
    toast.success("Logout Success");
  };
  return (
    <div className="flex flex-col justify-start h-full">
      <div className="border-b-[1px] border-white p-4 flex-row w-full flex items-center gap-2">
        <Box
          component="img"
          alt="Widgets"
          src="/assets/logo.png"
          sx={{
            height: "50px",
            width: "50px",
            maxWidth: "50px",
            borderRadius: 2,
          }}
        />
        <div className="font-merienda font-bold text-3xl">BKCycling</div>
      </div>
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col p-4 gap-4">
          <div className="flex flex-col text-white">
            <Link href="/dashboard">
              <div className="p-2 bg-indigo-500 flex rounded-lg flex-row items-center">
                <BarChartIcon />
                <span className="ml-2 font-normal text-sm">Overview</span>
              </div>
            </Link>
          </div>
          <div className="flex flex-col text-white">
            <Link href="/dashboard/account">
              <div className="p-2 bg-indigo-500 flex rounded-lg flex-row items-center">
                <PeopleAltIcon />
                <span className="ml-2 font-normal text-sm">Account</span>
              </div>
            </Link>
          </div>
          <div className="flex flex-col text-white">
            <Link href="/dashboard/station">
              <div className="p-2 bg-indigo-500 flex rounded-lg flex-row items-center">
                <LocalGasStationIcon />
                <span className="ml-2 font-normal text-sm">Station</span>
              </div>
            </Link>
          </div>
          <div className="flex flex-col text-white">
            <Link href="/dashboard/cycling">
              <div className="p-2 bg-indigo-500 flex rounded-lg flex-row items-center">
                <DirectionsBikeIcon />
                <span className="ml-2 font-normal text-sm">Cycling</span>
              </div>
            </Link>
          </div>
          <div className="flex flex-col text-white">
            <Link href="/dashboard/ticket">
              <div className="p-2 bg-indigo-500 flex rounded-lg flex-row items-center">
                <ConfirmationNumberIcon />
                <span className="ml-2 font-normal text-sm">Ticket</span>
              </div>
            </Link>
          </div>
        </div>
        <div className="flex flex-col text-white p-4">
          <div
            onClick={handleLogout}
            className="p-2 bg-[#FABF0C] flex rounded-lg flex-row items-center justify-center cursor-pointer"
          >
            <LogoutIcon />
            <span className="ml-2 font-normal text-sm">Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
