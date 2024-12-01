/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { Button, Col, Input, notification, Row, Select, Spin } from 'antd';
import { getAllProductOnChain, getProductOnChain } from '@/api/product';
import ProductForm from './productmodal';
import { ProductOnChainCard } from './productonchain';
import { PaginationComponent } from '@/components/componentspage/pagination';

const ProductTable = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [paginatedProducts, setPaginatedProducts] = useState<any[]>([]);

    const showModal = () => setIsModalOpen(true);
    const handleCancel = () => setIsModalOpen(false);

    const handleTokenIdDelete = (tokenId: number) => {
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== tokenId));
        setPaginatedProducts((prevProducts) => prevProducts.filter((product) => product.id !== tokenId));
    };

    const handleProductCreated = async (tokenId: number) => {
        try {
            const newProduct = await getProductOnChain(tokenId);
            setProducts((prevProducts) => [...prevProducts, newProduct]);
            setPaginatedProducts((prevProducts) => [...prevProducts, newProduct].slice(-4));

            notification.success({
                message: 'Product Added',
                description: 'A new product has been added successfully!',
            });
        } catch (error) {
            console.error('Error adding new product:', error);
            notification.error({
                message: 'Error',
                description: 'Failed to add the new product to the list.',
            });
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await getAllProductOnChain();
            if (data?.product_ids?.length > 0) {
                const productDetails = await Promise.all(
                    data.product_ids.map((tokenId: number) => getProductOnChain(tokenId))
                );
                setProducts(productDetails);
                setPaginatedProducts(productDetails.slice(0, 4));
            } else {
                setProducts([]);
                setPaginatedProducts([]);
            }
        } catch (error) {
            notification.error({
                message: 'Error loading products',
                description: 'Unable to load products from on-chain.',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handlePageChange = (paginatedProducts: any[]) => {
        setPaginatedProducts(paginatedProducts);
    };

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 20,
                }}
            >
                <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>Manage Products</span>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Input.Search placeholder="Search" style={{ width: 200, marginRight: 20 }} />
                    <Select placeholder="Filter by role and status" style={{ width: 150, marginRight: 20 }}>
                        <Select.Option value="">All</Select.Option>
                        <Select.Option value="admin">Admin</Select.Option>
                        <Select.Option value="customer">Customer</Select.Option>
                        <Select.Option value="active">Active</Select.Option>
                        <Select.Option value="not-active">Not Active</Select.Option>
                    </Select>
                    <Select placeholder="Sort by" style={{ width: 150, marginRight: 20 }}>
                        <Select.Option value="">None</Select.Option>
                        <Select.Option value="abcAsc">Name A-Z</Select.Option>
                        <Select.Option value="abcDesc">Name Z-A</Select.Option>
                        <Select.Option value="createdAtAsc">Oldest Created</Select.Option>
                        <Select.Option value="createdAtDesc">Newest Created</Select.Option>
                    </Select>
                </div>
                <Button onClick={showModal}>New Product</Button>
            </div>

            {loading ? (
                <Spin size="large" />
            ) : (
                <div>
                    {products.length === 0 ? (
                        <p>No products found.</p>
                    ) : (
                        <>
                            <Row gutter={[24, 24]}>
                                {paginatedProducts.map((product) => (
                                    <Col span={6} key={product.id}>
                                        <ProductOnChainCard id={product.id} onDeleteSuccess={handleTokenIdDelete} />
                                    </Col>
                                ))}
                            </Row>
                            <PaginationComponent
                                products={products}
                                pageSize={4}
                                onPageChange={handlePageChange}
                            />
                        </>
                    )}
                </div>
            )}

            <ProductForm
                isOpen={isModalOpen}
                onClose={handleCancel}
                onProductCreated={handleProductCreated}
            />
        </>
    );
};

export default ProductTable;
