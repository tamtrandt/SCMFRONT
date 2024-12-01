/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { BrowserProvider, JsonRpcProvider, Wallet, Signer } from 'ethers';
import { Button, TextField, Typography, Box, Alert, Avatar } from '@mui/material';
import { sendWalletAddressToBackend } from '@/api/wallet';
import MetaMaskIcon from '@/public/images/Metalogo.png';
import Image from 'next/image';


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
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
        >


            <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '1rem' }}>
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
                        sx={{
                            marginBottom: '1rem',
                            backgroundColor: '#f6851b',
                            color: '#ffffff',
                            '&:hover': {
                                backgroundColor: '#e2761b',
                            },
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                        }}
                    >
                        <Image src={MetaMaskIcon} alt="MetaMask Icon" width={20} height={20} />
                        Connect with MetaMask
                    </Button>

                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        OR
                    </Typography>

                    <TextField
                        label="Private Key"
                        type="password"
                        fullWidth
                        value={privateKey}
                        onChange={(e) => setPrivateKey(e.target.value)}
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                            },
                        }}
                    />

                    <Button
                        variant="contained"
                        fullWidth
                        onClick={connectWithPrivateKey}
                        sx={{
                            backgroundColor: '#0070f3',
                            color: '#ffffff',
                            '&:hover': {
                                backgroundColor: '#005bb5',
                            },
                        }}
                    >
                        Connect with Private Key
                    </Button>
                </>
            ) : (
                <Box sx={{ marginTop: '1rem', textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Wallet Connected
                    </Typography>
                    <Typography variant="body2" sx={{ marginTop: '0.5rem' }}>
                        <strong>Address:</strong> {address}
                    </Typography>
                    <Typography variant="body2" sx={{ marginBottom: '1rem' }}>
                        <strong>Balance:</strong> {balance} ETH
                    </Typography>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={disconnectWallet}
                        sx={{
                            borderRadius: '8px',
                        }}
                    >
                        Disconnect Wallet
                    </Button>
                </Box>
            )}
        </Box>
    );
}

export default WalletConnector;
