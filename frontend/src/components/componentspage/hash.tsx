'use client'
import { CopyOutlined } from '@ant-design/icons';
import { message } from 'antd';
import React from 'react';

type FormatAndCopyHashProps = {
    hash: string;
};

const FormatAndCopyHash = ({ hash }: FormatAndCopyHashProps) => {
    if (!hash) return <span />;

    const start = hash.slice(0, 5);
    const end = hash.slice(-5);
    const formattedHash = `${start}...${end}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(hash)
            .then(() => message.success('Copied to clipboard!'))
            .catch(() => message.error('Failed to copy'));
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>{formattedHash}</span>
            <CopyOutlined
                onClick={handleCopy}
                style={{ marginLeft: 8, cursor: 'pointer', color: '#1890ff' }}
            />
        </div>
    );
};

export default FormatAndCopyHash;