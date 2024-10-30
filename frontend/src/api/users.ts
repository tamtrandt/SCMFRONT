/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchAPI } from "./fetch";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";



export const createUser = async (userData: any) => {
  try {
      const response = await fetchAPI('/users/create', {
          method: 'POST',
          body: userData,
      });
      return response; // Trả về dữ liệu phản hồi từ server
  } catch (error) {
      // Ném lại lỗi với thông điệp từ server
      if (error instanceof Error) {
          throw new Error(error.message); // Ném thông điệp lỗi
      }
      throw new Error('Failed to create user'); // Thông báo lỗi mặc định
  }
};


// Hàm gọi API để lấy tất cả người dùng
export const getAllUsers = async () => {
  try {
    const data = await fetchAPI('/users', {
      method: 'GET',
    });

    return data; // Trả về dữ liệu sau khi thành công
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error; // Ném lỗi ra để frontend có thể xử lý
  }
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