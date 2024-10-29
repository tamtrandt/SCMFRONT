/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useEffect, useState } from 'react';
import { Card, Col, Row, } from 'antd';
import { DeleteOutlined, EditOutlined, SyncOutlined, } from '@ant-design/icons';
import { getProductById } from '@/api/product';
import { PaginationComponent } from '@/components/pages/pagination';
import { QRDisplay } from '@/components/pages/qrcode';
import { ProductOffChain, ProductOnChain } from '@/components/utils/interfaces';
import { formatTransactionHash } from '@/components/utils/functions';




interface ProductListProps {
    products: ProductOffChain[];
    loading: boolean; // Thêm thuộc tính loading vào đây
}


export const ProductList = ({ products, loading }: ProductListProps) => {
    const pageSize = 4; // Số sản phẩm trên mỗi trang
    const [paginatedProducts, setPaginatedProducts] = useState(products.slice(0, pageSize));
    useEffect(() => {
        setPaginatedProducts(products.slice(0, pageSize));
    }, [products]);

    const [productData, setProductData] = useState<ProductOnChain | null>(null);
    const [loadingProduct, setLoadingProduct] = useState(false);
    const [showProductDetails, setShowProductDetails] = useState<{ [key: string]: boolean }>({});
    const [productStatus, setProductStatus] = useState<{ [key: string]: boolean }>({}); // Trạng thái cho từng sản phẩm

    useEffect(() => {
        // Khởi tạo trạng thái cho từng sản phẩm
        const initialStatus: { [key: string]: boolean } = {};
        products.forEach(product => {
            initialStatus[product.id] = product.isOnChain; // Giả sử bạn đã có trường isOnChain trong product
        });
        setProductStatus(initialStatus);
    }, [products]);

    const handleFetchProduct = async (id: string) => {
        if (showProductDetails[id]) {
            setShowProductDetails((prev) => ({ ...prev, [id]: false }));
            setProductData(null);
        } else {
            setLoadingProduct(true);
            try {
                const data = await getProductById(id);
                setProductData(data);
                setShowProductDetails((prev) => ({ ...prev, [id]: true }));
                setProductStatus((prev) => ({ ...prev, [id]: true })); // Cập nhật trạng thái thành On-chain khi fetch thành công
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoadingProduct(false);
            }
        }
    };

    const handleStatusToggle = (productId: string) => {
        handleFetchProduct(productId);
        // Toggle trạng thái của sản phẩm
        setProductStatus((prev) => ({
            ...prev,
            [productId]: !prev[productId] // Đảo trạng thái giữa On-chain và Off-chain
        }));
    };

    const handleEdit = (productId: string) => {

    };

    const handleDelete = async (productId: string) => {

    };



    return (
        <>
            <Row gutter={24}>
                {loading ? (
                    <Col style={{ textAlign: 'center', width: '100%' }}>
                        <p>Loading...</p>
                    </Col>
                ) : (
                    paginatedProducts.map((product) => (
                        <Col key={product.id} span={6} style={{ display: 'flex', justifyContent: 'center' }}>
                            <Card
                                bordered={false}
                                style={{
                                    height: '500px',
                                    width: '300px',
                                    padding: '5px',
                                    border: '3px solid black',
                                    borderRadius: '10px',
                                    margin: '5px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between', // canh nội dung
                                }}
                            >
                                <div>
                                    {showProductDetails[product.id] && productData && productData.id === product.id ? (
                                        <>
                                            <p><strong>Name:</strong> {productData.name}</p>
                                            <p><strong>Description:</strong> {productData.description}</p>
                                            <p><strong>Price:</strong> {productData.price}</p>
                                            <p><strong>Quantity:</strong> {productData.quantity}</p>
                                            <p><strong>Brand:</strong> {productData.brand}</p>
                                            <p><strong>Category:</strong> {productData.category}</p>
                                            <p><strong>Size:</strong> {productData.size}</p>
                                            <p><strong>Status:</strong> {productData.status}</p>
                                            <p><strong>Creator:</strong> {productData.creater}</p>
                                        </>
                                    ) : (
                                        <>
                                            <QRDisplay qrcodes={product.qrcode} />
                                            <p style={{ fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                <strong>Product ID:</strong> {formatTransactionHash(product.id)}
                                            </p>
                                            <p style={{ fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                <strong>Transaction Hash:</strong> {formatTransactionHash(product.transactionHash)}
                                            </p>
                                            <p style={{ fontSize: '12px' }}>
                                                <strong>Created At:</strong> {new Date(product.create_at).toLocaleString()}
                                            </p>
                                            <p style={{ fontSize: '12px' }}>
                                                <strong>Updated At:</strong> {new Date(product.update_at).toLocaleString()}
                                            </p>
                                            <p style={{ fontSize: '12px' }}>
                                                <strong>Status:</strong> {product.isDeleted ? 'Deleted' : 'Active'}
                                            </p>
                                        </>
                                    )}
                                </div>
                                {/* Phần icon cập nhật, xóa, và button chuyển trạng thái */}
                                <Row justify="space-between" align="middle" style={{ borderTop: '1px solid #f0f0f0', paddingTop: '10px', marginTop: 'auto' }}>
                                    <Col>
                                        <EditOutlined style={{ fontSize: '18px', color: '#1890ff', cursor: 'pointer' }} onClick={() => handleEdit(product.id)} />
                                        <DeleteOutlined style={{ fontSize: '18px', color: '#ff4d4f', marginLeft: '10px', cursor: 'pointer' }} onClick={() => handleDelete(product.id)} />
                                    </Col>
                                    <Col>
                                        <button
                                            style={{
                                                border: 'none',
                                                backgroundColor: 'transparent',
                                                color: productStatus[product.id] ? '#52c41a' : '#faad14', // Cập nhật màu dựa trên trạng thái của sản phẩm cụ thể
                                                cursor: 'pointer',
                                                fontSize: '16px',
                                            }}
                                            onClick={() => handleStatusToggle(product.id)}
                                        >
                                            <SyncOutlined /> {productStatus[product.id] ? 'On-chain' : 'Off-chain'}
                                        </button>
                                        {loadingProduct && <p>Loading...</p>}
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>
            {/* Hiển thị thông tin phân trang */}
            <PaginationComponent
                products={products}
                pageSize={pageSize}
                onPageChange={setPaginatedProducts}
            />
        </>
    );
}





