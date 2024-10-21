/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FetchOptions {
    method: "GET" | "POST" | "PUT" | "DELETE";
    body?: any;
  }
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  
  export const fetchAPI = async (endpoint: string, options: FetchOptions) => {
    const { method, body } = options;
  
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
  
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || "An error occurred");
    }
  
    return data;
  };