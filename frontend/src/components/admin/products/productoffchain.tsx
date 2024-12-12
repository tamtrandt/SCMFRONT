/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect } from 'react';
import { Modal, Table, Spin } from 'antd';
import { getProductOffChain } from '@/api/product';
import FormatAndCopyHash from '@/components/componentspage/hash';

interface ProductOffChainCardProps {
    id: number;
    visible: boolean;
    onClose: () => void;
}

export const ProductOffChainCard: React.FC<ProductOffChainCardProps> = ({ id, visible, onClose }) => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch product details when id changes
    useEffect(() => {
        const fetchProducts = async () => {
            if (!id) return;

            setLoading(true);
            try {
                const data = await getProductOffChain(id);
                setProducts(data);
                console.log(data);
            } catch {
                setError('Failed to fetch product details.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [id]);

    // Show loading spinner while data is being fetched
    if (loading) return <Spin size="large" />;

    // Show error message if fetching fails
    if (error) return <div>{error}</div>;

    // Columns configuration for the table
    const columns = [
        {
            title: 'Transaction Hash',
            dataIndex: 'transactionHash',
            key: 'transactionHash',
            render: (text: string) => <FormatAndCopyHash hash={text} />,
        },
        {
            title: 'Action',
            dataIndex: ['event', 'action'],
            key: 'action',
        },
        {
            title: 'Creator',
            dataIndex: ['event', 'creator'],
            key: 'creator',
            render: (text: string) => <FormatAndCopyHash hash={text} />,
        },
        {
            title: 'Timestamp',
            dataIndex: ['event', 'timestamp'],
            key: 'timestamp',
            render: (text: string) => new Date(text).toLocaleString('en-US', { hour12: false }),
        },
        {
            title: 'QR Code',
            dataIndex: 'qrCode',
            key: 'qrCode',
            render: (text: string) => <img src={text} alt="QR Code" style={{ width: '100px' }} />,

        }
    ];

    // Prepare the data for the table
    const dataSource = products.map((product, index) => ({
        key: index,
        transactionHash: product.transactionHash,
        event: product.event,
        qrCode: product.qrCode,
    }));

    return (
        <Modal
            title="Transaction Details"
            open={visible}
            onCancel={onClose}
            footer={null}
            centered
            width={1000}
            styles={{
                body: { padding: '16px 24px', overflow: 'auto' },
            }}
        >
            <Table
                columns={columns}
                dataSource={dataSource}
                pagination={{ pageSize: 5 }}
                scroll={{ x: 'max-content' }}
                size="middle"
            />
        </Modal>
    );
};
