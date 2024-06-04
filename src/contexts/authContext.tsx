"use client";
import { auth } from "@/FirebaseConfig";
import { useRouter } from "next/navigation";

import React, { createContext, useReducer, useEffect } from "react";
import { toast } from "react-toastify";

interface UserContextProps {
  user: any;
  dispatch?: React.Dispatch<any>;
}

const INITIAL_STATE: UserContextProps = { user: null };

export const UserContext = createContext<UserContextProps>(INITIAL_STATE);

const UserReducer = (state: any, action: any) => {
  switch (action.type) {
    case "LOGIN_SUCCESS": {
      return { user: action.payload };
    }
    case "LOGOUT": {
      auth.signOut();
      sessionStorage.removeItem("token");
      return { user: null };
    }
    case "LOGIN_FAILURE": {
      toast.error("Login Failure");
      return { user: null };
    }
    default:
      return state;
  }
};

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const [state, dispatch] = useReducer(UserReducer, INITIAL_STATE);
  const router = useRouter();

  useEffect(() => {
    auth.onAuthStateChanged(async (admin) => {
      if (!admin) {
        router.replace("/login");
      } else {
        const token = await admin.getIdToken();
        console.log("token", token);
        sessionStorage.setItem("token", token);
      }
    });
  }, []);

  return (
    <UserContext.Provider
      value={{
        user: state.user,
        dispatch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
