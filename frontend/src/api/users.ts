/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchAPI } from "./fetch";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

// Create a new user
export const createUser = async (userData: any) => {
  try {
    const response = await fetchAPI('/users/create', {
      method: 'POST',
      body: userData,
    });
    return response;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create user');
  }
};

// Get all users
export const getAllUsers = async () => {
  try {
    const data = await fetchAPI('/users', {
      method: 'GET',
    });
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Get the user's profile
export const getProfile = async () => {
  const token = Cookies.get("access_token");
  if (!token) {
    throw new Error("Token not found");
  }

  const decodedToken = jwtDecode<{ sub: string }>(token);  // Decode the token to get user id
  const userId = decodedToken.sub;

  return await fetchAPI(`/users/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Update user information
export const updateUser = async (id: string, updateUserDto: any) => {
  const token = Cookies.get("access_token");
  if (!token) {
    throw new Error("Token not found");
  }

  return await fetchAPI(`/users/${id}`, {
    method: "PUT",
    body: updateUserDto,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Delete user account
export const deleteUser = async (id: string) => {
  const token = Cookies.get("access_token");
  if (!token) {
    throw new Error("Token not found");
  }

  return await fetchAPI(`/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
