/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { BrowserProvider, JsonRpcProvider, Wallet, Signer } from 'ethers';
import { Button, TextField, Typography, Box, Alert } from '@mui/material';
import { sendWalletAddressToBackend } from '@/api/wallet';


interface WalletConnectorProps {
    onConnect: (provider: JsonRpcProvider | BrowserProvider, signer: Signer) => void;
}

const WalletConnector: React.FC<WalletConnectorProps> = ({ onConnect }) => {
    const [privateKey, setPrivateKey] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [balance, setBalance] = useState<string | null>(null);

    useEffect(() => {
        const savedAddress = localStorage.getItem('connectedWalletAddress');
        const savedBalance = localStorage.getItem('connectedWalletBalance');
        if (savedAddress && savedBalance) {
            setAddress(savedAddress);
            setBalance(savedBalance);
        }
    }, []);

    const connectWithMetaMask = async () => {
        setError(null);
        if (typeof (window as any).ethereum === 'undefined') {
            setError('MetaMask is not installed. Please install MetaMask to continue.');
            return;
        }

        try {
            const provider = new BrowserProvider((window as any).ethereum);
            const signer = await provider.getSigner();
            const walletAddress = await signer.getAddress();
            const balance = await provider.getBalance(walletAddress);
            const formattedBalance = (parseFloat(balance.toString()) / 10 ** 18).toFixed(4);

            setAddress(walletAddress);
            setBalance(formattedBalance);
            localStorage.setItem('connectedWalletAddress', walletAddress);
            localStorage.setItem('connectedWalletBalance', formattedBalance);
            onConnect(provider, signer);

            // Gửi địa chỉ ví đến backend
            await sendWalletAddressToBackend(walletAddress);
            alert('Connected with MetaMask!');
        } catch (err) {
            setError('Failed to connect with MetaMask. Please try again.');
            console.error(err);
        }
    };

    const connectWithPrivateKey = async () => {
        setError(null);
        if (!privateKey.trim()) {
            setError('Please enter a valid private key.');
            return;
        }

        try {
            const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL || 'http://127.0.0.1:8545'); // Default to localhost
            const signer = new Wallet(privateKey, provider);
            const walletAddress = await signer.getAddress();
            const balance = await provider.getBalance(walletAddress);
            const formattedBalance = (parseFloat(balance.toString()) / 10 ** 18).toFixed(4);

            setAddress(walletAddress);
            setBalance(formattedBalance);
            localStorage.setItem('connectedWalletAddress', walletAddress);
            localStorage.setItem('connectedWalletBalance', formattedBalance);
            onConnect(provider, signer);

            // Gửi địa chỉ ví đến backend
            await sendWalletAddressToBackend(walletAddress);
            alert('Connected with Private Key!');
        } catch (err) {
            setError('Failed to connect with the provided private key.');
            console.error(err);
        }
    };

    const disconnectWallet = () => {
        setAddress(null);
        setBalance(null);
        localStorage.removeItem('connectedWalletAddress');
        localStorage.removeItem('connectedWalletBalance');
        sessionStorage.removeItem('WalletToken'); // Clear WalletToken from sessionStorage
        alert('Disconnected from wallet.');
    };

    return (
        <Box
            sx={{
                maxWidth: '400px',
                margin: 'auto',
                padding: '2rem',
                textAlign: 'center',
                border: '1px solid #ccc',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9',
            }}
        >
            <Typography variant="h4" gutterBottom>
                Connect Wallet
            </Typography>

            {error && (
                <Alert severity="error" sx={{ marginBottom: '1rem' }}>
                    {error}
                </Alert>
            )}

            {!address ? (
                <>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={connectWithMetaMask}
                        sx={{ marginBottom: '1rem' }}
                    >
                        Connect with MetaMask
                    </Button>

                    <Typography variant="body1" gutterBottom>
                        OR
                    </Typography>

                    <TextField
                        label="Private Key"
                        type="password"
                        fullWidth
                        value={privateKey}
                        onChange={(e) => setPrivateKey(e.target.value)}
                        sx={{ marginBottom: '1rem' }}
                    />

                    <Button variant="contained" fullWidth onClick={connectWithPrivateKey}>
                        Connect with Private Key
                    </Button>
                </>
            ) : (
                <Box sx={{ marginTop: '1rem', textAlign: 'center' }}>
                    <Typography variant="h6">Wallet Connected</Typography>
                    <Typography variant="body1">Address: {address}</Typography>
                    <Typography variant="body1">Balance: {balance} ETH</Typography>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={disconnectWallet}
                        sx={{ marginTop: '1rem' }}
                    >
                        Disconnect Wallet
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default WalletConnector;
