/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect } from 'react';
import { Modal, Table, Spin } from 'antd';
import { getProductOffChain } from '@/api/product'; // Giả sử bạn đã có API này
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

    // Fetch dữ liệu sản phẩm khi id thay đổi
    useEffect(() => {
        const fetchProducts = async () => {
            if (!id) return; // Nếu không có id thì không làm gì cả

            try {
                const data = await getProductOffChain(id); // Lấy dữ liệu từ API
                setProducts(data); // Lưu mảng sản phẩm vào state
            } catch (error) {
                setError('Failed to fetch product details.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [id]); // Chạy lại khi id thay đổi

    // Nếu đang load, hiển thị spin
    if (loading) return <Spin size="large" />;

    // Hiển thị thông báo lỗi nếu có
    if (error) return <div>{error}</div>;

    // Cấu hình các cột của bảng
    const columns = [
        {
            title: 'Transaction Hash',
            dataIndex: 'transactionHash',
            key: 'transactionHash',
            render: (text: string) => (
                <FormatAndCopyHash hash={text} /> // Sử dụng FormatAndCopyHash để hiển thị transaction hash
            ),
        },
        {
            title: 'Action',
            dataIndex: ['event', 'action'],
            key: 'action',
        },
        {
            title: 'Initiator',
            dataIndex: ['event', 'initiator'],
            key: 'initiator',
            render: (text: string) => <FormatAndCopyHash hash={text} /> // Sử dụng FormatAndCopyHash cho initiator
        },
        {
            title: 'Timestamp',
            dataIndex: ['event', 'timestamp'],
            key: 'timestamp',
            render: (text: string) =>
                new Date(text).toLocaleString('en-US', { hour12: false }),
        },
        {
            title: 'Additional Info',
            dataIndex: ['event', 'additionalInfo'],
            key: 'additionalInfo',
            render: (text: string) => <FormatAndCopyHash hash={text} />

        },
    ];

    // Chuẩn bị dữ liệu cho bảng
    const dataSource = products.map((product, index) => ({
        key: index,
        transactionHash: product.transactionHash,
        event: product.event,
        initiator: product.event.initiator,
        timestamp: product.event.timestamp,
        additionalInfo: product.event.additionalInfo,
    }));

    return (
        <Modal
            title="Product Off-Chain Details"
            open={visible} // Điều khiển modal mở hay đóng
            onCancel={onClose} // Gọi onClose khi đóng modal
            footer={null}
            centered
            width={1000} // Tăng chiều rộng modal để chứa bảng rộng hơn
            styles={{
                body: { padding: '16px 24px', overflow: 'auto' },
            }}
        >
            <Table
                columns={columns}
                dataSource={dataSource}
                pagination={{ pageSize: 5 }} // Số trang mỗi lần hiển thị
                scroll={{ x: 'max-content' }} // Thêm cuộn ngang để tránh tràn bảng
                size="middle" // Điều chỉnh kích thước bảng để dễ đọc hơn
            />
        </Modal>
    );
};