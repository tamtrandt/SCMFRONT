import React from 'react';
import { ethers } from 'ethers';

const ConnectModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner();
                const address = await signer.getAddress();
                console.log("Connected address:", address);
                onClose(); // Đóng modal sau khi kết nối thành công
            } catch (err) {
                console.error("Connection error:", err);
            }
        } else {
            alert("MetaMask không được cài đặt. Vui lòng cài đặt MetaMask để tiếp tục.");
        }
    };

    return (
        <div className="modal">
            <h2>Kết nối MetaMask</h2>
            <button onClick={connectWallet}>Kết nối</button>
            <button onClick={onClose}>Đóng</button>
        </div>
    );
};

export default ConnectModal;
