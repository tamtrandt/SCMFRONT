/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FetchOptions {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  headers?: Record<string, string>; // Cho phép tùy chỉnh headers từ options
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const fetchAPI = async (endpoint: string, options: FetchOptions) => {
  const { method, body, headers: customHeaders = {} } = options;

  // Lấy WalletToken từ sessionStorage
  const WalletToken = sessionStorage.getItem('WalletToken');

  if (!WalletToken) {
    console.warn('WalletToken not found in sessionStorage. Ensure wallet is connected.');
  }

  const headers: Record<string, string> = {
    ...customHeaders, // Thêm headers tùy chỉnh từ options
    Authorization: WalletToken ? `Bearer ${WalletToken}` : '', // Đính kèm WalletToken nếu tồn tại
  };

  // Thêm Content-Type khi body không phải là FormData
  if (!(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  // Thực hiện fetch API
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body instanceof FormData ? body : JSON.stringify(body),
  });

  let data;
  try {
    data = await res.json(); // Parse JSON response
  } catch (error) {
    console.error('Error parsing response JSON:', error);
    throw new Error('Invalid JSON response from server.');
  }

  if (!res.ok) {
    throw new Error(data?.message || 'An error occurred while fetching data.');
  }

  return data; // Trả về dữ liệu từ API
};

