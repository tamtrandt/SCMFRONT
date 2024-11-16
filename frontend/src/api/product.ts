/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/services/product.ts


import { CreateProduct } from "@/components/utils/interfaces";
import { fetchAPI } from "./fetch";



// Hàm gọi API để tạo sản phẩm
export const createProduct = async (product: CreateProduct) => {
  const formData = new FormData();

  // Add các trường vào formData
  formData.append('name', product.name);
  formData.append('description', product.description);
  formData.append('price', product.price.toString());
  formData.append('quantity', product.quantity.toString());
  formData.append('brand', product.brand); // Thêm brand
  formData.append('category', product.category);
  formData.append('size', product.size);   // Thêm size

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



export const updateProduct = async (id: string , productData: any) => {
 
  
  const data = await fetchAPI(`/products/update/${id}`, {
        method: 'PUT',
        body: productData,
      });
      console.log(data);
      return data;
     
};
    

// Hàm gọi API để lấy tất cả sản phẩm
export const getAllProductOffChain = async () => {
  try {
    // Gọi API lấy danh sách sản phẩm từ endpoint
    const data = await fetchAPI('/products/offchainall/all', {
      method: 'GET',
    });

    return data; // Trả về dữ liệu sau khi thành công
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error; // Ném lỗi ra để frontend có thể xử lý
  }
};
// Hàm gọi API để lấy sản phẩm theo ID OFF CHAIN
export const getProductOffChain = async (id: string) => {
  try {
    const data = await fetchAPI(`/products/offchain/${id}`, {
      method: 'GET',
    });

    return data; 
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error; 
  }
};


// Hàm gọi API để lấy sản phẩm theo ID ON CHAIN
export const getProductOnChain = async (id: string) => {
  try {
    const data = await fetchAPI(`/products/onchain/${id}`, {
      method: 'GET',
    });

    return data; 
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error; 
  }
};

// Hàm gọi API để lấy all sản phẩm 
export const getAllProductOnChain = async () => {
  try {
    const data = await fetchAPI(`/products/onchainall/all`, {
      method: 'GET',
    });

    return data; 
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error; 
  }
};


export const deleteProduct = async (id: string) => {
     return await fetchAPI(`/products/delete/${id}`, { 
      method: 'DELETE',
    });
};





































