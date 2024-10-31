/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { getProductOnChain } from '@/api/product';
import FormatAndCopyHash from '@/components/componentspage/hash';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Spin } from 'antd';
import React, { useEffect, useState } from 'react';




interface ProductOnChainCardProps {
    id: string;
}

export const ProductOnChainCard: React.FC<ProductOnChainCardProps> = ({ id }) => {
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) {
                setError('Product ID is required.');
                setLoading(false);
                return;
            }

            try {
                const data = await getProductOnChain(id); // Gọi API để lấy dữ liệu sản phẩm
                console.log(data); // Kiểm tra dữ liệu nhận được

                // Thiết lập trạng thái cho sản phẩm từ dữ liệu trả về
                setProduct({
                    id: data.id, // Lấy ID từ dữ liệu trả về
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    quantity: data.quantity,
                    brand: data.brand,
                    category: data.category,
                    size: data.size,
                    status: data.status,
                    cids: data.cids, // Sử dụng cids trực tiếp từ dữ liệu
                    creater: data.creater,
                });
            } catch (error) {
                setError('Failed to fetch product details.');
                console.error(error); // Log lỗi ra console
            } finally {
                setLoading(false); // Kết thúc trạng thái loading
            }
        };

        fetchProduct(); // Gọi hàm fetch sản phẩm
    }, [id]);

    if (loading) {
        return <div><Spin size="large" /></div>; // Hiển thị loading
    }

    if (error) {
        return <div>{error}</div>; // Hiển thị thông báo lỗi
    }

    return (
        <>
            <p style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px' }}>
                <strong>Creator:</strong>
                <span style={{ marginLeft: '5px', fontWeight: 'normal' }}>
                    <FormatAndCopyHash hash={product.creater} />
                </span>
            </p>
            <p style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>
                <strong>Name:</strong> {product.name}
            </p>
            <p style={{ marginBottom: '16px', color: '#666' }}>
                <strong>Description:</strong> {product.description}
            </p>

            <Row gutter={16}>
                <Col span={12}>
                    <p style={{ fontWeight: 'bold' }}><strong>Price:</strong> ${product.price.toFixed(2)}</p>
                </Col>
                <Col span={12}>
                    <p style={{ fontWeight: 'bold' }}><strong>Quantity:</strong> {product.quantity}</p>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <p style={{ fontWeight: 'bold' }}><strong>Brand:</strong> {product.brand}</p>
                </Col>
                <Col span={12}>
                    <p style={{ fontWeight: 'bold' }}><strong>Size:</strong> {product.size}</p>
                </Col>
            </Row>

            <Row justify="space-between" style={{ marginTop: '20px' }}>
                <Col>
                    <Button
                        type="primary"

                        style={{ marginRight: '8px' }}
                    >
                        <EditOutlined />
                    </Button>
                </Col>
                <Col>
                    <Button
                        type="default"
                        danger

                    >
                        <DeleteOutlined />
                    </Button>
                </Col>
            </Row>
        </>
    );
};
