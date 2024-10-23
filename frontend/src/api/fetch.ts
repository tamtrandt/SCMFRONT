/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FetchOptions {
    method: "GET" | "POST" | "PUT" | "DELETE";
    body?: any;
  }
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  
  export const fetchAPI = async (endpoint: string, options: FetchOptions) => {
    const { method, body } = options;
  
    const headers: Record<string, string> = {};
    if (!(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'; // Chỉ thêm Content-Type khi body không phải FormData
    }
  
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body instanceof FormData ? body : JSON.stringify(body), // Nếu là FormData thì gửi trực tiếp, không chuyển sang JSON
    });
  
    const data = await res.json();
  
    if (!res.ok) {
      throw new Error(data.message || 'An error occurred');
    }
  
    return data;
  };