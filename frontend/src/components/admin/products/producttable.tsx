/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { Button, Col, Input, notification, Row, Select, Spin } from 'antd';
import { getAllProductOnChain, getProductOnChain } from '@/api/product';
import ProductForm from './productmodal';
import { ProductOnChainCard } from './productonchain';
import { PaginationComponent } from '@/components/componentspage/pagination';
import { GetProductOnChain } from '@/components/utils/interfaces';

const ProductTable = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [paginatedProducts, setPaginatedProducts] = useState<any[]>([]);
    const validBrands = ['adidas', 'puma', 'nike'];

    // New states for search, filter, and sort
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBrand, setFilterBrand] = useState('');
    const [sortOption, setSortOption] = useState('');

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
            handleDataProcessing([...products, newProduct]);

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
                handleDataProcessing(productDetails);
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

    const handleDataProcessing = (
        productList: GetProductOnChain[] = products,
        currentSearchTerm = searchTerm,
        currentFilterBrand = filterBrand,
        currentSortOption = sortOption
    ) => {
        let filteredProducts = [...productList];

        // Apply search filter
        if (currentSearchTerm) {
            const lowerCaseSearch = currentSearchTerm.toLowerCase().trim();
            filteredProducts = filteredProducts.filter(
                (product: GetProductOnChain) =>
                    (product?.name?.toLowerCase() || '').includes(lowerCaseSearch) ||
                    (product?.creater?.toLowerCase() || '').includes(lowerCaseSearch) ||
                    String(product?.id || '').includes(lowerCaseSearch)
            );
        }

        // Apply brand filter
        if (currentFilterBrand) {
            filteredProducts = filteredProducts.filter(
                (product) => (product?.brand?.toLowerCase() || '') === currentFilterBrand.toLowerCase()
            );
        }

        // Apply sorting
        if (currentSortOption) {
            switch (currentSortOption) {
                case 'priceAsc':
                    filteredProducts.sort((a, b) => (a?.price || 0) - (b?.price || 0));
                    break;
                case 'priceDesc':
                    filteredProducts.sort((a, b) => (b?.price || 0) - (a?.price || 0));
                    break;
                case 'quantityAsc':
                    filteredProducts.sort((a, b) => (a?.quantity || 0) - (b?.quantity || 0));
                    break;
                case 'quantityDesc':
                    filteredProducts.sort((a, b) => (b?.quantity || 0) - (a?.quantity || 0));
                    break;
                default:
                    break;
            }
        }

        setPaginatedProducts(filteredProducts.slice(0, 4));
    };

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
                    {/* Search Input */}
                    <Input.Search
                        placeholder="Search by Name, Creator, ID"
                        style={{ width: 200, marginRight: 20 }}
                        onChange={(e) => {
                            const newSearchTerm = e.target.value;
                            setSearchTerm(newSearchTerm);
                            handleDataProcessing(products.map(p => ({ ...p })), newSearchTerm, filterBrand, sortOption);
                        }}
                    />

                    {/* Filter by Brand */}
                    <Select
                        placeholder="Filter by Brand"
                        style={{ width: 150, marginRight: 20 }}
                        onChange={(value) => {
                            const newFilterBrand = value;
                            setFilterBrand(newFilterBrand);
                            handleDataProcessing(products.map(p => ({ ...p })), searchTerm, newFilterBrand, sortOption);
                        }}
                    >
                        <Select.Option value="adidas">Adidas</Select.Option>
                        <Select.Option value="puma">Puma</Select.Option>
                        <Select.Option value="nike">Nike</Select.Option>
                    </Select>

                    {/* Sort by */}
                    <Select
                        placeholder="Sort by"
                        style={{ width: 150, marginRight: 20 }}
                        onChange={(value) => {
                            const newSortOption = value;
                            setSortOption(newSortOption);
                            handleDataProcessing(products.map(p => ({ ...p })), searchTerm, filterBrand, newSortOption);
                        }}
                    >
                        <Select.Option value="">None</Select.Option>
                        <Select.Option value="priceAsc">Price Low to HighHigh</Select.Option>
                        <Select.Option value="priceDesc">Price High to LowLow</Select.Option>
                        <Select.Option value="quantityAsc">Quantity Low to High</Select.Option>
                        <Select.Option value="quantityDesc">Quantity High to Low</Select.Option>
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
