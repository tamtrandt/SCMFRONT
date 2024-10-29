import { fetchAPI } from "./fetch";
import { CreateUser, UpdateUser } from "@/components/utils/interfaces";

// Hàm gọi API để tạo người dùng
export const createUser = async (user: CreateUser) => {
  try {
    const data = await fetchAPI('/users', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json', // Đặt kiểu nội dung là JSON
      },
    });

    return data; // Trả về dữ liệu sau khi thành công
  } catch (error) {
    console.error('Error creating user:', error);
    throw error; // Ném lỗi ra để frontend có thể xử lý
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

// Hàm gọi API để cập nhật thông tin người dùng
export const updateUser = async (id: string, updateUserDto: Partial<UpdateUser>) => {
  try {
    const data = await fetchAPI(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateUserDto),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return data; // Trả về dữ liệu sau khi thành công
  } catch (error) {
    console.error('Error updating user:', error);
    throw error; // Ném lỗi ra để frontend có thể xử lý
  }
};

// Hàm gọi API để xóa người dùng
export const deleteUser = async (id: string) => {
  try {
    const result = await fetchAPI(`/users/${id}`, {
      method: 'DELETE',
    });

    return result; // Trả về dữ liệu sau khi thành công
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error; // Ném lỗi ra để frontend có thể xử lý
  }
};