'use client'
import React from 'react';
import { Table } from 'antd';

export interface Product {
    id: string;
    transactionHash: string;
    qrcode: string;
    create_at: Date;
    update_at: Date;
    isDeleted: boolean;
}

interface ProductListProps {
    products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Transaction Hash',
            dataIndex: 'transactionHash',
            key: 'transactionHash',
        },
        {
            title: 'QR Code',
            dataIndex: 'qrcode',
            key: 'qrcode',
            render: (text: string) => <img src={text} alt="QR Code" style={{ width: 100, height: 100 }} />, // Hiển thị QR code dưới dạng hình ảnh
        },
        {
            title: 'Created At',
            dataIndex: 'create_at',
            key: 'create_at',
            render: (text: Date) => new Date(text).toLocaleString(), // Định dạng thời gian
        },
        {
            title: 'Updated At',
            dataIndex: 'update_at',
            key: 'update_at',
            render: (text: Date) => new Date(text).toLocaleString(), // Định dạng thời gian
        },
        {
            title: 'Status',
            dataIndex: 'isDeleted',
            key: 'isDeleted',
            render: (text: boolean) => (text ? 'Deleted' : 'Active'), // Hiển thị trạng thái
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={products}
            rowKey="id" // Sử dụng ID làm khóa duy nhất cho mỗi hàng
            pagination={{ pageSize: 10 }} // Phân trang, điều chỉnh theo nhu cầu
        />
    );
};

export default ProductList;
