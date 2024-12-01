import React, { useState } from 'react';
import { Button } from 'antd';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import NoImage from '@/public/images/NoImage.png';


interface ImageDisplayProps {
    imagecids: string[];
}

export const ImageDisplay = ({ imagecids }: ImageDisplayProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        if (currentIndex < imagecids.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const prevImage = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const hasImages = imagecids && imagecids.length > 0;
    const currentImageUrl = hasImages
        ? imagecids[currentIndex].replace('ipfs://', 'https://ipfs.io/ipfs/')
        : (typeof NoImage === 'string' ? NoImage : NoImage.src);;

    return (
        <div style={{ textAlign: 'center', marginBottom: 10, position: 'relative' }}>
            <Button
                onClick={prevImage}
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
                src={currentImageUrl}
                alt={hasImages ? `Image ${currentIndex + 1}` : 'Default Image'}
                style={{ width: 200, height: 200, marginBottom: 10 }}
            />

            <Button
                onClick={nextImage}
                disabled={currentIndex === imagecids.length - 1}
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