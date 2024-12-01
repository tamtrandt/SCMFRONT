import { fetchAPI } from "./fetch";

export const sendWalletAddressToBackend = async (address: string): Promise<string> => {
  try {
    const response = await fetchAPI('/smartcontract/connectWallet', {
      method: 'POST',
      body: { walletAddress: address },
    });

    console.log('Response from backend:', response);

    const { WalletToken } = response;
    if (!WalletToken) {
      throw new Error('No WalletToken returned from backend');
    }

    sessionStorage.setItem('WalletToken', WalletToken);
    console.log('WalletToken saved to sessionStorage successfully.');
    return WalletToken;
  } catch (error) {
    console.error('Error sending wallet address to backend:', error);
    throw error;
  }
};
