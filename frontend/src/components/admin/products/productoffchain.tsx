/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { getProductOffChain } from '@/api/product';
import FormatAndCopyHash from '@/components/componentspage/hash';
import { QRDisplay } from '@/components/componentspage/qrcode';
import { Card, Col, Row, Spin } from 'antd';
import React, { useEffect, useState } from 'react';


interface ProductOffChainCardProps {
    id: number;
}

export const ProductOffChainCard: React.FC<ProductOffChainCardProps> = ({ id }) => {
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductOffChain(id);
                setProduct(data);
            } catch (error) {
                setError('Failed to fetch product details.');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return <div><Spin size="large" /></div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <QRDisplay qrcodes={product.qrcode} /> {/* Hiển thị QR code */}

            <Row gutter={16} style={{ marginTop: '20px' }}>
                <Col span={24}>
                    <div style={{ fontSize: '14px', display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <strong style={{ flexShrink: 0 }}>Product ID:</strong>
                        <span style={{ marginLeft: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {product.id}
                        </span>
                    </div>
                    <div style={{ fontSize: '14px', display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <strong style={{ flexShrink: 0 }}>Transaction Hash:</strong>
                        <span style={{ marginLeft: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            <FormatAndCopyHash hash={product.transactionHash} />
                        </span>
                    </div>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <p style={{ fontSize: '14px', marginBottom: '8px' }}>
                        <strong>Created At:</strong> {new Date(product.create_at).toLocaleString()}
                    </p>
                </Col>
                <Col span={12}>
                    <p style={{ fontSize: '14px', marginBottom: '8px' }}>
                        <strong>Last Update:</strong> {new Date(product.update_at).toLocaleString()}
                    </p>
                </Col>

            </Row>
        </>
    );
};