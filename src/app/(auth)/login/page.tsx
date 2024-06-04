"use client";
import { auth } from "@/FirebaseConfig";
import { UserContext } from "@/contexts/authContext";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";

export default function Login() {
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const { dispatch } = useContext(UserContext);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleLogin = async () => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
      toast.success("Login Success");
      dispatch && dispatch({ type: "LOGIN_SUCCESS", payload: res.user });
    } catch (e) {
      dispatch && dispatch({ type: "LOGIN_FAILURE" });
    }
  };
  return (
    <div className="h-full flex flex-1 bg-white justify-center items-center">
      <div className=" flex flex-col items-start justify-start text-gray-700">
        <Stack spacing={1}>
          <Typography variant="h4" fontWeight={500}>
            Đăng nhập
          </Typography>
        </Stack>
        <Box py={4}>
          <div className="flex flex-col justify-start w-96 gap-4 pb-4">
            <TextField
              id="outlined-basic"
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormControl sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Mật khẩu
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
          </div>

          <button
            onClick={handleLogin}
            type="submit"
            className="w-full bg-[#FABF0C] text-base mt-4 text-[#1A1A1A] font-bold rounded-xl text-center py-3 cursor-pointer"
          >
            Đăng nhập
          </button>
        </Box>
      </div>
    </div>
  );
}
