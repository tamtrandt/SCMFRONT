/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FetchOptions {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  headers?: Record<string, string>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const fetchAPI = async (endpoint: string, options: FetchOptions) => {
  const { method, body, headers: customHeaders = {} } = options;

  const WalletToken = sessionStorage.getItem('WalletToken');

  if (!WalletToken) {
    console.warn('WalletToken not found in sessionStorage.');
  }

  const headers: Record<string, string> = {
    ...customHeaders,
    Authorization: WalletToken ? `Bearer ${WalletToken}` : '',
  };

  if (!(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body instanceof FormData ? body : JSON.stringify(body),
  });

  let data;
  try {
    data = await res.json();
  } catch (error) {
    console.error('Error parsing response JSON:', error);
    throw new Error('Invalid JSON response from server.');
  }

  if (!res.ok) {
    throw new Error(data?.message || 'An error occurred while fetching data.');
  }

  return data;
};
