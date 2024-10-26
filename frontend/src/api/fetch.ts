/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FetchOptions {
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>; // Cho phép tùy chỉnh headers từ options
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const fetchAPI = async (endpoint: string, options: FetchOptions) => {
  const { method, body, headers: customHeaders = {} } = options;

  const headers: Record<string, string> = {
      ...customHeaders, // Thêm headers tùy chỉnh từ options
  };

  // Thêm Content-Type khi body không phải là FormData
  if (!(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body instanceof FormData ? body : JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
      throw new Error(data.message || 'An error occurred');
  }

  return data;
};