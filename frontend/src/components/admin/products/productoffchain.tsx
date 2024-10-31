/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { getProductOffChain } from '@/api/product';
import FormatAndCopyHash from '@/components/componentspage/hash';
import { QRDisplay } from '@/components/componentspage/qrcode';
import { Card, Col, Row, Spin } from 'antd';
import React, { useEffect, useState } from 'react';


interface ProductOffChainCardProps {
    id: string;
}

export const ProductOffChainCard: React.FC<ProductOffChainCardProps> = ({ id }) => {
    const [product, setProduct] = useState<any>(null); // Trạng thái để lưu dữ liệu sản phẩm
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductOffChain(id); // Gọi API
                setProduct(data); // Giả định dữ liệu trả về đúng định dạng
            } catch (error) {
                setError('Failed to fetch product details.'); // Lưu lỗi nếu có
            } finally {
                setLoading(false); // Đặt trạng thái loading là false
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
            <QRDisplay qrcodes={product.qrcode} /> {/* Hiển thị QR code */}

            <Row gutter={16} style={{ marginTop: '20px' }}>
                <Col span={12}>
                    <div style={{ fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-flex', alignItems: 'center' }}>
                        <strong>Product ID:</strong>
                        <span style={{ marginLeft: '5px' }}>
                            <FormatAndCopyHash hash={product.id} />
                        </span>
                    </div>

                    <div style={{ fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-flex', alignItems: 'center' }}>
                        <strong>Transaction Hash:</strong>
                        <span style={{ marginLeft: '5px' }}>
                            <FormatAndCopyHash hash={product.transactionHash} />
                        </span>
                    </div>
                </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: '10px' }}>
                <Col span={12}>
                    <p style={{ fontSize: '12px' }}>
                        <strong>Created At:</strong> {new Date(product.create_at).toLocaleString()}
                    </p>
                </Col>
                <Col span={12}>
                    <p style={{ fontSize: '12px' }}>
                        <strong>Updated At:</strong> {new Date(product.update_at).toLocaleString()}
                    </p>
                </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: '10px' }}>
                <Col span={24}>
                    <p style={{ fontSize: '12px' }}>
                        <strong>Status:</strong> {product.isDeleted ? 'Deleted' : 'Active'}
                    </p>
                </Col>
            </Row>
        </>
    );
};