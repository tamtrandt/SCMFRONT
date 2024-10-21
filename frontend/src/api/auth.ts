/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchAPI } from "./fetch";
import Cookies from "js-cookie";



interface AuthValues {
  email: string;
  password: string;
  code?: string;
}

// Đăng ký tài khoản
export const registerUser = async (values: AuthValues) => {
  return await fetchAPI("/auth/register", {
    method: "POST",
    body: values,
  });
};

// Xác thực email
export const verifyEmail = async (code: string) => {
  return await fetchAPI("/auth/verify", {
    method: "POST",
    body: { code },
  });
};

// Gửi lại mã xác thực
export const resendCode = async (email: string) => {
  return await fetchAPI("/auth/resendcode", {
    method: "POST",
    body: { email },
  });
};

// Đăng nhập và lưu token vào cookies

export const loginUser = async (values: AuthValues) => {
   
    const data = await fetchAPI("/auth/login", {
        method: "POST",
        body: values,
    });
    const userObject = data.user;
    

    // Lưu token vào cookies
    Cookies.set("access_token", data.access_token, {
        // httpOnly: true,
        // secure: true,
        // sameSite: "Strict",
        path: "/",
        expires: 1/24 // Thời gian sống 1 giờ
    });

    // Lưu role vào cookies từ đối tượng user
    // Cookies.set("user_role", data.user.role, {
    //     path: "/", 
    // });
    // Cookies.set("user_data", JSON.stringify(userObject), {
    //     path: "/",
    // });
     // Lưu đối tượng user vào localStorage
     localStorage.setItem("user_data", JSON.stringify(userObject));

    
    return data;
   

};