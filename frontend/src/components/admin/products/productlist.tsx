/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Spin, } from 'antd';
import { DeleteOutlined, EditOutlined, SyncOutlined, } from '@ant-design/icons';
import { getProductById } from '@/api/product';
import { PaginationComponent } from '@/components/componentspage/pagination';
import { QRDisplay } from '@/components/componentspage/qrcode';
import { ProductOffChain, ProductOnChain } from '@/components/utils/interfaces';
import FormatAndCopyHash from '@/components/componentspage/hash';





interface ProductListProps {
    products: ProductOffChain[];
    loading: boolean; // Thêm thuộc tính loading vào đây
}


export const ProductList = ({ products, loading }: ProductListProps) => {
    const pageSize = 4; // Số sản phẩm trên mỗi trang
    const [currentPage, setCurrentPage] = useState(1);
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
                        <p><Spin size="large" /></p>
                    </Col>
                ) : (
                    paginatedProducts.map((product) => (
                        <Col key={product.id} span={6} style={{ display: 'flex', justifyContent: 'center' }}>
                            <Card
                                bordered={false}
                                style={{
                                    height: '525px',
                                    width: '300px',
                                    padding: '5px',
                                    border: '3px solid black',
                                    borderRadius: '10px',
                                    margin: '5px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                }}
                            >
                                {/* Phần button chuyển trạng thái */}
                                <Row justify="space-between" align="middle" style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>
                                    <Col>
                                        <button
                                            style={{
                                                border: 'none',
                                                backgroundColor: 'transparent',
                                                color: productStatus[product.id] ? '#52c41a' : '#faad14',
                                                cursor: 'pointer',
                                                fontSize: '16px',
                                            }}
                                            onClick={() => handleStatusToggle(product.id)}
                                        >
                                            <SyncOutlined /> {productStatus[product.id] ? 'On-chain' : 'Off-chain'}
                                        </button>
                                        {loadingProduct && <p><Spin size="large" /></p>}
                                    </Col>
                                </Row>
                                <div style={{ flexGrow: 1 }}> {/* Duy trì không gian cho nội dung */}
                                    {showProductDetails[product.id] && productData && productData.id === product.id ? (
                                        <>
                                            <p style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px' }}>
                                                <strong>Creator:</strong>
                                                <span style={{ marginLeft: '5px', fontWeight: 'normal' }}>
                                                    <FormatAndCopyHash hash={productData.creater} />
                                                </span>
                                            </p>
                                            <p style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>
                                                <strong>Name:</strong> {productData.name}
                                            </p>
                                            <p style={{ marginBottom: '16px', color: '#666' }}>
                                                <strong>Description:</strong> {productData.description}
                                            </p>

                                            <Row gutter={16}>
                                                <Col span={12}>
                                                    <p style={{ fontWeight: 'bold' }}><strong>Price:</strong> {productData.price}</p>
                                                </Col>
                                                <Col span={12}>
                                                    <p style={{ fontWeight: 'bold' }}><strong>Quantity:</strong> {productData.quantity}</p>
                                                </Col>
                                            </Row>

                                            <Row gutter={16}>
                                                <Col span={12}>
                                                    <p style={{ fontWeight: 'bold' }}><strong>Brand:</strong> {productData.brand}</p>
                                                </Col>
                                                <Col span={12}>
                                                    <p style={{ fontWeight: 'bold' }}><strong>Size:</strong> {productData.size}</p>
                                                </Col>
                                            </Row>

                                            <Row justify="space-between" style={{ marginTop: '20px' }}>
                                                <Col>
                                                    <Button
                                                        type="primary"
                                                        onClick={() => handleEdit(product.id)}
                                                        style={{ marginRight: '8px' }}
                                                    >
                                                        <EditOutlined />
                                                    </Button>
                                                </Col>
                                                <Col>
                                                    <Button
                                                        type="default"
                                                        danger
                                                        onClick={() => handleDelete(product.id)}
                                                    >
                                                        <DeleteOutlined />
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </>
                                    ) : (
                                        <>
                                            <QRDisplay qrcodes={product.qrcode} />
                                            <p style={{ fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-flex', alignItems: 'center' }}>
                                                <strong>Product ID:</strong> <span style={{ marginLeft: '5px' }}><FormatAndCopyHash hash={product.id} /></span>
                                            </p>
                                            <p style={{ fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-flex', alignItems: 'center' }}>
                                                <strong>Transaction Hash:</strong> <span style={{ marginLeft: '5px' }}><FormatAndCopyHash hash={product.transactionHash} /></span>
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





