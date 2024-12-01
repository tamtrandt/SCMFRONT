import React from 'react';
import { Modal } from 'antd';
import WalletConnector from './walletconnector';


interface WalletModalProps {
    visible: boolean;
    onClose: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ visible, onClose }) => {
    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
        >
            <WalletConnector onConnect={(provider, signer) => {
                console.log("Wallet connected:", provider, signer);
                onClose();
            }} />
        </Modal>
    );
};

export default WalletModal;
