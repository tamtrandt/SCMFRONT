/* eslint-disable @typescript-eslint/no-unused-vars */
// src/services/product.ts

import { fetchAPI } from "./fetch";


interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  quantity: number;
  status: string;
  files: File[]; // Chúng ta sẽ truyền files ở dạng File array
}

// Hàm gọi API để tạo sản phẩm
export const createProduct = async (product: CreateProductDto) => {
  const formData = new FormData();

  // Add các trường vào formData
  formData.append('name', product.name);
  formData.append('description', product.description);
  formData.append('price', product.price.toString());
  formData.append('quantity', product.quantity.toString());
  formData.append('status', product.status);

  // Add các file vào formData
  product.files.forEach((file) => {
    formData.append('files', file); // Nếu backend yêu cầu field khác, đổi 'files' thành tên field chính xác
  });

  try {
    // Sử dụng hàm fetchAPI, không cần convert formData thành JSON
    const data = await fetchAPI('/products', {
      method: 'POST',
      body: formData, // Gửi formData trực tiếp
    });

    return data; // Trả về dữ liệu sau khi thành công
  } catch (error) {
    console.error('Error creating product:', error);
    throw error; // Ném lỗi ra để frontend có thể xử lý
  }
};

// Hàm gọi API để lấy tất cả sản phẩm
export const getAllProducts = async () => {
  try {
    // Gọi API lấy danh sách sản phẩm từ endpoint
    const data = await fetchAPI('/products/dashboard/products', {
      method: 'GET',
    });

    return data; // Trả về dữ liệu sau khi thành công
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error; // Ném lỗi ra để frontend có thể xử lý
  }
};







