/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/services/product.ts


import { CreateProduct } from "@/components/utils/interfaces";
import { fetchAPI, fetchAPIJsol } from "./fetch";



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


export const updateMetadata = async (id: number , productData: any) => {
  const data = await fetchAPI(`/products/update/${id}/metadata`, {
        method: 'PUT',
        body: productData,
      });
      console.log(data);
      return data;
     
};
// Gọi API update giá
export const updatePrice = async (id: number,  price: any ) => {
  const data = await fetchAPI(`/products/update/${id}/price`, {
      method: 'PATCH', 
     body: {price},  
  });
  return data;
};

// Gọi API update số lượng
export const updateQuantity = async (id: number, quantity: any) => {
    const data = await fetchAPI(`/products/update/${id}/quantity`, {
      method: 'PATCH',
      body: {quantity},  
    });
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
export const getProductOffChain = async (id: number) => {
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
// Hàm chuyển đổi IPFS URL sang HTTP URL
const resolveIpfsUrl = (url: string) => {
  if (url.startsWith('ipfs://')) {
    // Thay thế bằng gateway IPFS
    return url.replace('ipfs://', 'https://ipfs.io/ipfs/');
  }
  return url;
};

export const getProductOnChain = async (id: number) => {
  try {
    // Gọi API lấy dữ liệu sản phẩm từ blockchain
    const data = await fetchAPI(`/products/onchain/${id}`, {
      method: 'GET',
    });

    if (!data || !data.data) {
      throw new Error('Invalid data format from API');
    }

    // Resolve URL metadata
    const metadataUrl = resolveIpfsUrl(data.data.metadata);
    const metadataResponse = await fetch(metadataUrl);
    if (!metadataResponse.ok) {
      throw new Error('Failed to fetch metadata');
    }
    const metadata = await metadataResponse.json();
    const price = parseFloat(data.data.price).toFixed(2);

    // Xử lý dữ liệu và trả về kết quả
    return {
      id: data.data.tokenId,
      name: metadata.name,
      description: metadata.description,
      price: parseFloat(price),
      quantity: parseInt(data.data.quantity.hex, 16),
      brand: metadata.brand,
      category: metadata.category,
      size: metadata.size,
      status: data.data.status,
      imagecids: metadata.imagecids,
      filecids: metadata.filecids,
      creater: metadata.creater,
      owner: data.data.owner,
    };
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


export const deleteProduct = async (id: number) => {
     return await fetchAPI(`/products/delete/${id}`, { 
      method: 'DELETE',
    });
};





































