/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchAPI } from "./fetch";
import Cookies from "js-cookie";
import { Login } from "@/components/utils/interfaces";

// Register user
export const registerUser = async (values: Login) => {
  return await fetchAPI("/auth/register", {
    method: "POST",
    body: values,
  });
};

// Verify email
export const verifyEmail = async (code: string) => {
  return await fetchAPI("/auth/verify", {
    method: "POST",
    body: { code },
  });
};

// Resend verification code
export const resendCode = async (email: string) => {
  return await fetchAPI("/auth/resendcode", {
    method: "POST",
    body: { email },
  });
};

// Login user and store token in cookies
export const loginUser = async (values: Login) => {
  const data = await fetchAPI("/auth/login", {
    method: "POST",
    body: values,
  });

  const userObject = data.user;

  // Store token in cookies and user data in local storage
  Cookies.set("access_token", data.access_token, {
    path: "/",
    expires: 24, 
  });

  localStorage.setItem("user_data", JSON.stringify(userObject));

  return data;
};
