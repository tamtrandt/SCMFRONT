/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { deleteProduct, getProductOnChain } from '@/api/product';
import FormatAndCopyHash from '@/components/componentspage/hash';
import { ImageDisplay } from '@/components/componentspage/image';
import { DeleteOutlined, EditOutlined, HistoryOutlined } from '@ant-design/icons';
import { Button, Card, Col, Modal, notification, Row, Spin } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { UpdateModal } from './updatemodal';
import { ProductOffChainCard } from './productoffchain';

interface ProductOnChainCardProps {
    id: number;
    onDeleteSuccess: (tokenId: number) => void;
}

export const ProductOnChainCard: React.FC<ProductOnChainCardProps> = ({ id, onDeleteSuccess }) => {
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [viewOnChain, setViewOnChain] = useState<boolean>(true); // Control On/Off chain
    const [visible, setVisible] = useState<boolean>(false); // For OffChain modal

    // Fetch product details
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
                ...data, // Spread data directly instead of assigning properties manually
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

    const handleUpdateSuccess = () => {
        fetchProduct(); // Refetch after update
    };

    const handleDelete = (id: number) => {
        Modal.confirm({
            title: 'Confirm Product Deletion',
            content: 'Are you sure you want to delete this product?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    const result = await deleteProduct(id);
                    onDeleteSuccess(id);
                    notification.success({
                        message: 'Product Deleted Successfully',
                        description: result.message,
                    });
                } catch (error) {
                    console.error('Error deleting product:', error);
                    notification.error({
                        message: 'Error Deleting Product',
                        description: 'An error occurred while deleting the product.',
                    });
                }
            },
        });
    };

    const handleEdit = (productId: number) => {
        setSelectedProductId(productId);
        setIsEditModalVisible(true);
    };

    const handleOpenOffChainModal = () => {
        setVisible(true); // Open OffChain modal
    };

    const handleCloseOffChainModal = () => {
        setVisible(false); // Close OffChain modal
    };

    if (loading) {
        return <Spin size="large" />;
    }

    if (error) {
        return <div>{error}</div>;
    }

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
                    {/* Button to view off-chain data */}
                    <Button
                        onClick={handleOpenOffChainModal}
                        style={{
                            backgroundColor: '#faad14',
                            color: '#fff',
                        }}
                    >
                        Transactions <HistoryOutlined />
                    </Button>

                    {/* Off-Chain Card modal */}
                    <ProductOffChainCard
                        id={product.id}
                        visible={visible}
                        onClose={handleCloseOffChainModal}
                    />

                    {/* Edit and Delete buttons */}
                    <Button type="primary" onClick={() => handleEdit(product.id)}>
                        <EditOutlined />
                    </Button>
                    <Button type="default" danger onClick={() => handleDelete(product.id)}>
                        <DeleteOutlined />
                    </Button>
                </div>

                {/* Product display */}
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

            {isEditModalVisible && selectedProductId && (
                <UpdateModal
                    visible={isEditModalVisible}
                    productId={selectedProductId}
                    onClose={() => setIsEditModalVisible(false)}
                    onUpdateSuccess={handleUpdateSuccess}
                />
            )}
        </>
    );
};
