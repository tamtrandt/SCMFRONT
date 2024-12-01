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
                setPaginatedProducts(productDetails.slice(0, 4));
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


    const handlePageChange = (paginatedProducts: any[]) => {
        setPaginatedProducts(paginatedProducts);
    };


    const handleSearch = () => {
        const filtered = products.filter((product) =>
            product.name.toLowerCase().includes()
        );
        setPaginatedProducts(filtered);
    };


    const handleFilter = () => {
        const filtered = products.filter((product) => product.category);
        setPaginatedProducts(filtered);
    };
    const handleSort = () => {

    };
    const { Search } = Input;
    const { Option } = Select;


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
                    placeholder="Search products"
                    allowClear
                    onSearch={(value: any) => handleSearch()}
                    style={{ flex: 2 }}
                />

                {/* Filter */}
                <Select
                    placeholder="Filter by category"
                    allowClear
                    onChange={(value) => handleFilter()}
                    style={{ flex: 1 }}
                >
                    <Option value="electronics">Electronics</Option>
                    <Option value="fashion">Fashion</Option>
                    <Option value="home-appliances">Home Appliances</Option>
                </Select>

                {/* Sort */}
                <Select
                    placeholder="Sort by"
                    allowClear
                    onChange={(value) => handleSort()}
                    style={{ flex: 1 }}
                >
                    <Option value="price-asc">Price: Low to High</Option>
                    <Option value="price-desc">Price: High to Low</Option>
                    <Option value="name-asc">Name: A-Z</Option>
                    <Option value="name-desc">Name: Z-A</Option>
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