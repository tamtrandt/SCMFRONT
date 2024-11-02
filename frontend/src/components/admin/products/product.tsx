/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { deleteProduct, getAllProductOffChain, updateProduct } from '@/api/product';
import React, { useEffect, useState } from 'react';
import { ProductOnChainCard } from './productonchain';
import { ProductOffChainCard } from './productoffchain';
import { Button, Card, Checkbox, Col, Modal, notification, Row } from 'antd';
import { PaginationComponent } from '@/components/componentspage/pagination';
import { DeleteOutlined, EditOutlined, SyncOutlined } from '@ant-design/icons';
import { GetProductOffChain, GetProductOnChain } from '@/components/utils/interfaces';
import ProductForm from './productmodal';
import UpdateProductModal from './updatemodal';

interface ProductListProps {
    products: GetProductOffChain[];
    onProductDeleted: (productId: string) => void; // Thêm callback này

}

export const ProductList = ({ products, onProductDeleted }: ProductListProps) => {
    const [viewOnChain, setViewOnChain] = useState<Record<string, boolean>>({});
    const [paginatedProducts, setPaginatedProducts] = useState<GetProductOffChain[]>([]);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState<GetProductOffChain | null>(null);




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

    const handleEdit = (product: GetProductOffChain) => {
        setEditingProduct(product);
        setIsEditModalVisible(true);
    };

    const handleEditModalOk = () => {
        // Xử lý cập nhật thông tin sản phẩm tại đây
        setIsEditModalVisible(false);
        setEditingProduct(null); // Reset sản phẩm đang chỉnh sửa
    };

    const handleEditModalCancel = () => {
        setIsEditModalVisible(false);
        setEditingProduct(null);
    };



    return (
        <>
            <Row gutter={24}>
                {paginatedProducts.map((product) => (
                    <Col key={product.id} span={6} style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
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

                                <Button type="primary" onClick={() => handleEdit(product)}>
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
                                            appearance: 'none', // Ẩn checkbox mặc định
                                            width: '20px', // Đường kính 10px
                                            height: '20px', // Đường kính 10px
                                            borderRadius: '50%', // Hình tròn
                                            border: '2px solid #1890ff', // Viền màu xanh
                                            outline: 'none', // Không có viền khi được chọn
                                            cursor: 'pointer', // Hiển thị con trỏ khi hover
                                            position: 'relative',
                                            margin: '0', // Xóa margin mặc định
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



            {/* Modal Edit Product */}
            <Modal
                title="Chỉnh sửa sản phẩm"
                open={isEditModalVisible}
                onOk={handleEditModalOk}
                onCancel={handleEditModalCancel}
            >
                {editingProduct && (
                    <div>
                        {/* Render form cho sản phẩm chỉnh sửa tại đây */}
                        <p>ID: {editingProduct.id}</p>
                        {/* Thêm các trường khác ở đây */}
                    </div>
                )}
            </Modal>







        </>
    );
};