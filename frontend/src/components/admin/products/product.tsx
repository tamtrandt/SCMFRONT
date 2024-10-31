/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { getAllProductOffChain } from '@/api/product';
import React, { useEffect, useState } from 'react';
import { ProductOnChainCard } from './productonchain';
import { ProductOffChainCard } from './productoffchain';
import { Button, Card, Col, Row } from 'antd';
import { PaginationComponent } from '@/components/componentspage/pagination';
import { SyncOutlined } from '@ant-design/icons';


interface Product {
    id: string;
}


export const ProductList = ({ products }: { products: Product[] }) => {
    const [viewOnChain, setViewOnChain] = useState<Record<string, boolean>>({});
    const [paginatedProducts, setPaginatedProducts] = useState<Product[]>([]); // Trạng thái cho sản phẩm hiển thị
    const pageSize = 4;

    useEffect(() => {
        // Cập nhật `paginatedProducts` mỗi khi `products` thay đổi
        setPaginatedProducts(products.slice(0, pageSize));
    }, [products]);

    const handleViewOnChain = (id: string) => {
        setViewOnChain((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    const handlePageChange = (newPaginatedProducts: Product[]) => {
        setPaginatedProducts(newPaginatedProducts);
    };

    return (
        <>
            <Row gutter={24}>
                {paginatedProducts.map((product) => (
                    <Col key={product.id} span={6} style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                        <Card
                            bordered={false}
                            style={{
                                height: '525px',
                                width: '300px',
                                padding: '5px',
                                border: '3px solid black',
                                borderRadius: '10px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Button
                                onClick={() => handleViewOnChain(product.id)}
                                style={{
                                    marginBottom: '10px',
                                    alignSelf: 'flex-end',
                                    backgroundColor: viewOnChain[product.id] ? '#52c41a' : '#faad14',
                                    color: '#fff',
                                }}
                            >
                                <SyncOutlined />
                                {viewOnChain[product.id] ? 'Data On-Chain' : 'Data Off-Chain'}
                            </Button>

                            {viewOnChain[product.id] ? (
                                <ProductOnChainCard id={product.id} />
                            ) : (
                                <ProductOffChainCard id={product.id} />
                            )}
                        </Card>
                    </Col>
                ))}
            </Row>
            <PaginationComponent
                products={products}
                pageSize={pageSize}
                onPageChange={handlePageChange}
            />
        </>
    );
};
