/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { getProductOnChain } from '@/api/product';
import { ProductOffChainCard } from '@/components/admin/products/productoffchain';
import FormatAndCopyHash from '@/components/componentspage/hash';
import { ImageDisplay } from '@/components/componentspage/image';
import { HistoryOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Button, Card, Col, message, Row, Spin } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';



interface ProductOnChainCardProps {
    id: number;
}
export const ProductDetail: React.FC<ProductOnChainCardProps> = ({ id }) => {
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [visible, setVisible] = useState(false);

    const fetchProduct = useCallback(async () => {
        if (!id) {
            setError('Product ID is required.');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await getProductOnChain(id);
            setProduct({
                id: data.id,
                name: data.name,
                description: data.description,
                price: data.price,
                quantity: data.quantity,
                brand: data.brand,
                category: data.category,
                size: data.size,
                status: data.status,
                imagecids: data.imagecids,
                filecids: data.filecids,
                creater: data.creater,
            });
        } catch (error) {
            setError('Failed to fetch product details.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);


    if (loading) {
        return <Spin size="large" />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const handleOpenOffChainModal = () => {
        setVisible(true);
    };

    const handleClose = () => {
        setVisible(false);
    };

    const handleCart = (
        productId: number,
        name: string,
        price: number,
        availableQuantity: number
    ) => {

        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const productIndex = cart.findIndex((item: { id: number }) => item.id === productId);

        if (productIndex === -1) {
            cart.push({
                id: productId,
                name,
                price,
                quantity: 1,
                availableQuantity,
            });
            message.success('Product added to cart!');
        } else {
            const existingProduct = cart[productIndex];
            if (existingProduct.quantity < existingProduct.availableQuantity) {
                existingProduct.quantity += 1;
                message.info('Product quantity updated!');
            } else {
                message.warning('Cannot add more than available quantity!');
            }
        }
        localStorage.setItem('cart', JSON.stringify(cart));
    };



    return (
        <>
            <Card
                bordered={false}
                style={{
                    height: '555px',
                    width: '300px',
                    padding: '5px',
                    border: '3px solid black',
                    borderRadius: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}
            >
                <div style={{ display: 'flex', marginBottom: '10px', alignItems: 'center' }}>
                    <Button
                        onClick={handleOpenOffChainModal}
                        style={{
                            backgroundColor: '#faad14',
                            color: '#fff',
                            width: '150px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        Transactions <HistoryOutlined />
                    </Button>

                    <ProductOffChainCard
                        id={product.id}
                        visible={visible}
                        onClose={handleClose}
                    />

                    <Button
                        type="default"
                        onClick={() => handleCart(product.id, product.name, product.price, product.quantity)}
                        style={{
                            backgroundColor: '#28a745',
                            color: '#fff',
                            width: '150px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <ShoppingCartOutlined />
                    </Button>
                </div>

                <ImageDisplay imagecids={product.imagecids} />
                <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', fontSize: '16px', marginBottom: '10px' }}>
                    <strong>Creator:</strong>
                    <span style={{ marginLeft: '5px', fontWeight: 'normal' }}>
                        <FormatAndCopyHash hash={product.creater} />
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', fontSize: '16px', marginBottom: '10px' }}>
                    <strong>Token Id:</strong>
                    <span style={{ marginLeft: '5px', fontWeight: 'normal' }}>
                        {product.id}
                    </span>
                </div>

                <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>
                    <strong>Name:</strong> {product.name}
                </div>
                <div style={{ marginBottom: '16px', color: '#666' }}>
                    <strong>Description:</strong> {product.description}
                </div>

                <Row gutter={16}>
                    <Col span={12}>
                        <p style={{ fontWeight: 'bold' }}><strong>Price:</strong> {product.price} ETH</p>
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
            </Card>

        </>
    );
};
