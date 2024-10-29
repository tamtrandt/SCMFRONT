/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtDecode } from "jwt-decode";
import { fetchAPI } from "./fetch";
import Cookies from "js-cookie";
import { Login } from "@/components/utils/interfaces";






// Đăng ký tài khoản
export const registerUser = async (values: Login) => {
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

export const loginUser = async (values: Login) => {
   
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
        expires: 24 
    });

     localStorage.setItem("user_data", JSON.stringify(userObject));

    
    return data;
   

};



export const getProfile = async () => {
  const token = Cookies.get("access_token");
  if (!token) {
    throw new Error("Token không tồn tại");
  }

  // Giải mã token để lấy thông tin người dùng
  const decodedToken = jwtDecode<{ sub: string }>(token); // Giả định rằng 'sub' là id người dùng
  const userId = decodedToken.sub;

  // Gọi API với userId
  return await fetchAPI(`/users/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Cập nhật thông tin người dùng
export const updateUser = async (id: string, updateUserDto: any) => {
  const token = Cookies.get("access_token");
  if (!token) {
    throw new Error("Token không tồn tại");
  }

  return await fetchAPI(`/users/${id}`, {
    method: "PUT",
    body: updateUserDto,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Xóa tài khoản người dùng
export const deleteUser = async (id: string) => {
  const token = Cookies.get("access_token");
  if (!token) {
    throw new Error("Token không tồn tại");
  }

  return await fetchAPI(`/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};