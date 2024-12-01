/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreateProduct } from "@/components/utils/interfaces";
import { fetchAPI } from "./fetch";

// Create product
export const createProduct = async (product: CreateProduct) => {
  const formData = new FormData();

  // Append product data to formData
  formData.append('name', product.name);
  formData.append('description', product.description);
  formData.append('price', product.price.toString());
  formData.append('quantity', product.quantity.toString());
  formData.append('brand', product.brand);
  formData.append('category', product.category);
  formData.append('size', product.size);

  // Add files to formData
  product.files.forEach((file) => {
    formData.append('files', file);
  });

  try {
    const data = await fetchAPI('/products', {
      method: 'POST',
      body: formData,
    });
    return data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Update product metadata
export const updateMetadata = async (id: number, productData: any) => {
  const data = await fetchAPI(`/products/update/${id}/metadata`, {
    method: 'PUT',
    body: productData,
  });
  console.log(data);
  return data;
};

// Update product price
export const updatePrice = async (id: number, price: any) => {
  const data = await fetchAPI(`/products/update/${id}/price`, {
    method: 'PATCH',
    body: { price },
  });
  return data;
};

// Update product quantity
export const updateQuantity = async (id: number, quantity: any) => {
  const data = await fetchAPI(`/products/update/${id}/quantity`, {
    method: 'PATCH',
    body: { quantity },
  });
  return data;
};

// Get product by ID (Off-chain)
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

// Resolve IPFS URL
const resolveIpfsUrl = (url: string) => {
  if (url.startsWith('ipfs://')) {
    return url.replace('ipfs://', 'https://ipfs.io/ipfs/');
  }
  return url;
};

// Get product by ID (On-chain)
export const getProductOnChain = async (id: number) => {
  try {
    const data = await fetchAPI(`/products/onchain/${id}`, {
      method: 'GET',
    });

    if (!data || !data.data) {
      throw new Error('Invalid data format from API');
    }

    const metadataUrl = resolveIpfsUrl(data.data.metadata);
    const metadataResponse = await fetch(metadataUrl);

    if (!metadataResponse.ok) {
      throw new Error('Failed to fetch metadata');
    }

    const metadata = await metadataResponse.json();
    const price = parseFloat(data.data.price).toFixed(2);

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

// Get all products (On-chain)
export const getAllProductOnChain = async () => {
  try {
    const data = await fetchAPI(`/products/onchainall/all`, {
      method: 'GET',
    });
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Delete product
export const deleteProduct = async (id: number) => {
  return await fetchAPI(`/products/delete/${id}`, {
    method: 'DELETE',
  });
};

// Buy tokens
export const buyTokens = async (tokenIds: number[], amounts: number[], totalPrice: string) => {
  const payload = {
    tokenIds,
    amounts,
    totalPrice,
  };

  try {
    const response = await fetchAPI('/products/buy', {
      method: 'POST',
      body: payload,
    });
    return response;
  } catch (error) {
    console.error('Error buying tokens:', error);
    throw error;
  }
};






























