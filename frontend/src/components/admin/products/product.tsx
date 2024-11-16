/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { deleteProduct, getProductOnChain } from '@/api/product';
import React, { useEffect, useState } from 'react';
import { ProductOnChainCard } from './productonchain';
import { ProductOffChainCard } from './productoffchain';
import { Button, Card, Col, Modal, notification, Row } from 'antd';
import { PaginationComponent } from '@/components/componentspage/pagination';
import { DeleteOutlined, EditOutlined, SyncOutlined } from '@ant-design/icons';
import { GetProductOffChain } from '@/components/utils/interfaces';
import { UpdateModal } from './updatemodal';


interface ProductListProps {
    products: GetProductOffChain[];
    onProductDeleted: (productId: string) => void; // Thêm callback này

}

export const ProductList = ({ products, onProductDeleted }: ProductListProps) => {
    const [viewOnChain, setViewOnChain] = useState<Record<string, boolean>>({});
    const [paginatedProducts, setPaginatedProducts] = useState<GetProductOffChain[]>([]);
    const pageSize = 4;
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);


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

    const handlePageChange = (newPaginatedProducts: GetProductOffChain[]) => {
        setPaginatedProducts(newPaginatedProducts);
    };

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: 'Xác nhận xóa sản phẩm',
            content: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
            okText: 'Có',
            okType: 'danger',
            cancelText: 'Không',
            onOk: async () => {
                try {
                    const result = await deleteProduct(id);
                    notification.success({
                        message: 'Xóa sản phẩm thành công',
                        description: result.message,
                    });

                    // Gọi hàm callback để thông báo với component cha cập nhật danh sách
                    onProductDeleted(id);
                } catch (error) {
                    console.error('Lỗi khi xóa sản phẩm:', error);
                    notification.error({
                        message: 'Lỗi khi xóa sản phẩm',
                        description: 'Đã xảy ra lỗi khi xóa sản phẩm.',
                    });
                }
            },
            onCancel() {
                console.log('Đã hủy xóa sản phẩm');
            },
        });
    };

    const handleEdit = (productId: string) => {
        setSelectedProductId(productId);
        setIsEditModalVisible(true);
    };
    // Function to reload the specific product





    return (
        <>
            <Row gutter={24}>
                {paginatedProducts.map((product) => (
                    <Col key={product.id} span={6} style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                        <Card
                            bordered={false}
                            style={{
                                height: '555px', // Có thể điều chỉnh chiều cao cố định nếu cần
                                width: '300px',
                                padding: '5px',
                                border: '3px solid black',
                                borderRadius: '10px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',

                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
                                {/* Nút Sync Data bên trái */}
                                <Button
                                    onClick={() => handleViewOnChain(product.id)}
                                    style={{
                                        backgroundColor: viewOnChain[product.id] ? '#52c41a' : '#faad14',
                                        color: '#fff',
                                    }}
                                >
                                    <SyncOutlined />
                                    {viewOnChain[product.id] ? 'On-Chain' : 'Off-Chain'}
                                </Button>

                                {/* Container cho các nút Edit và Delete bên phải */}
                                <Button type="primary" onClick={() => handleEdit(product.id)}>
                                    <EditOutlined />
                                </Button>
                                <Button type="default" danger onClick={() => handleDelete(product.id)}>
                                    <DeleteOutlined />
                                </Button>

                                {/* Checkbox cho user chọn */}
                                <div style={{ display: 'flex', marginLeft: '30px', alignItems: 'center' }}>
                                    <input
                                        type="checkbox"
                                        style={{
                                            appearance: 'none',
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            border: '2px solid #1890ff',
                                            outline: 'none',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            margin: '0',
                                        }}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                e.target.style.backgroundColor = '#52c41a'; // Màu xanh lá cây khi chọn
                                            } else {
                                                e.target.style.backgroundColor = 'transparent'; // Màu nền mặc định
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Nội dung hiển thị trong card */}

                            {viewOnChain[product.id] ? (
                                <ProductOnChainCard id={product.id} />
                            ) : (
                                <ProductOffChainCard id={product.id} />
                            )}

                        </Card>
                    </Col>
                ))}
            </Row>





            {isEditModalVisible && selectedProductId && (
                <UpdateModal
                    visible={isEditModalVisible}
                    productId={selectedProductId}
                    onClose={() => setIsEditModalVisible(false)}

                />
            )}





            <PaginationComponent
                products={products}
                pageSize={pageSize}
                onPageChange={handlePageChange}
            />


        </>

    );
};