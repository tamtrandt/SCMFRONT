import React, { useState } from 'react';
import { Button } from 'antd';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';

interface QRDisplayProps {
    qrcodes: string[];
}

export const QRDisplay = ({ qrcodes }: QRDisplayProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextQR = () => {
        if (currentIndex < qrcodes.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const prevQR = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <div style={{ textAlign: 'center', marginBottom: 10, position: 'relative' }}>
            <Button
                onClick={prevQR}
                disabled={currentIndex === 0}
                style={{
                    position: 'absolute',
                    left: '-25px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    height: '60px',
                    width: '60px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    padding: 0,
                    cursor: 'pointer',
                    fontSize: '24px',
                }}
                icon={<DoubleLeftOutlined />}
            />
            <img
                src={qrcodes[currentIndex]}
                alt="QR Code"
                style={{ width: 230, height: 230, marginBottom: 10 }}
            />
            <Button
                onClick={nextQR}
                disabled={currentIndex === qrcodes.length - 1}
                style={{
                    position: 'absolute',
                    right: '-25px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    height: '60px',
                    width: '60px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    padding: 0,
                    cursor: 'pointer',
                    fontSize: '28px',
                }}
                icon={<DoubleRightOutlined />}
            />
        </div>
    );
};
