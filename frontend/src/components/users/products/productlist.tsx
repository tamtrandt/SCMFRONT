/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import { Button, Col, Input, notification, Row, Select, Spin } from 'antd';
import { getAllProductOnChain, getProductOnChain } from '@/api/product';
import { PaginationComponent } from '@/components/componentspage/pagination';
import { ProductDetail } from './productdetail';

const ProductList = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [paginatedProducts, setPaginatedProducts] = useState<any[]>([]);
    
    // New states for search, filter, and sort
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBrand, setFilterBrand] = useState('');
    const [sortOption, setSortOption] = useState('');

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await getAllProductOnChain();
            if (data?.product_ids?.length > 0) {
                const productDetails = await Promise.all(
                    data.product_ids.map(async (tokenId: number) => {
                        const product = await getProductOnChain(tokenId);
                        return product;
                    })
                );
                setProducts(productDetails);
                handleDataProcessing(productDetails);
            } else {
                setProducts([]);
                setPaginatedProducts([]);
            }
        } catch (error) {
            notification.error({
                message: 'Lỗi khi tải sản phẩm',
                description: 'Không thể tải danh sách sản phẩm từ on-chain.',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDataProcessing = (
        productList: any[] = products,
        currentSearchTerm = searchTerm,
        currentFilterBrand = filterBrand,
        currentSortOption = sortOption
    ) => {
        let filteredProducts = [...productList];

        // Apply search filter
        if (currentSearchTerm) {
            const lowerCaseSearch = currentSearchTerm.toLowerCase().trim();
            filteredProducts = filteredProducts.filter(
                (product) =>
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

    const { Search } = Input;

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
                <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>Marketplace</span>
            </div>

            {/* Search, Filter, and Sort */}
            <div style={{ display: 'flex', marginBottom: 20, gap: 10 }}>
                {/* Search */}
                <Search
                    placeholder="Search by Name, Creator, ID"
                    allowClear
                    style={{ flex: 2 }}
                    onChange={(e) => {
                        const newSearchTerm = e.target.value;
                        setSearchTerm(newSearchTerm);
                        handleDataProcessing(products.map(p => ({ ...p })), newSearchTerm, filterBrand, sortOption);
                    }}
                />

                {/* Filter by Brand */}
                <Select
                    placeholder="Filter by Brand"
                    allowClear
                    style={{ flex: 1 }}
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

                {/* Sort */}
                <Select
                    placeholder="Sort by"
                    allowClear
                    style={{ flex: 1 }}
                    onChange={(value) => {
                        const newSortOption = value;
                        setSortOption(newSortOption);
                        handleDataProcessing(products.map(p => ({ ...p })), searchTerm, filterBrand, newSortOption);
                    }}
                >
                    <Select.Option value="priceAsc">Price: Low to High</Select.Option>
                    <Select.Option value="priceDesc">Price: High to Low</Select.Option>
                    <Select.Option value="quantityAsc">Quantity: Low to High</Select.Option>
                    <Select.Option value="quantityDesc">Quantity: High to Low</Select.Option>
                </Select>
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
                                        <ProductDetail id={product.id} />
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
        </>
    );
}

export default ProductList;