/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { deleteProduct, getProductOnChain } from '@/api/product';
import FormatAndCopyHash from '@/components/componentspage/hash';
import { ImageDisplay } from '@/components/componentspage/image';
import { DeleteOutlined, EditOutlined, SyncOutlined } from '@ant-design/icons';
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewOnChain, setViewOnChain] = useState<boolean>(true); // Điều khiển trạng thái On/Off chain
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [visible, setVisible] = useState(false); // For OffChain modal

    // Fetch product details from API
    // Định nghĩa fetchProduct ở ngoài useEffect
    const fetchProduct = useCallback(async () => {
        if (!id) {
            setError('Product ID is required.');
            setLoading(false);
            return;
        }

        try {
            setLoading(true); // Đảm bảo loading được set đúng trạng thái
            const data = await getProductOnChain(id);
            setProduct({
                id: data.id,
                name: data.name,
                description: data.description,
                price: data.price,
                quantity: data.quantity,
                brand: data.brand,
                category: data.category,
                size: data.size,
                status: data.status,
                imagecids: data.imagecids,
                filecids: data.filecids,
                creater: data.creater,
            });
        } catch (error) {
            setError('Failed to fetch product details.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [id]); // Phụ thuộc vào id

    // Gọi fetchProduct trong useEffect khi id thay đổi
    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    const handleUpdateSuccess = () => {
        fetchProduct(); // Hàm fetch lại data sau khi update thành công
    };

    if (loading) {
        return <Spin size="large" />; // Hiển thị loading
    }

    if (error) {
        return <div>{error}</div>; // Hiển thị thông báo lỗi
    }


    const handleDelete = (id: number) => {
        Modal.confirm({
            title: 'Xác nhận xóa sản phẩm',
            content: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
            okText: 'Có',
            okType: 'danger',
            cancelText: 'Không',
            onOk: async () => {
                try {
                    const result = await deleteProduct(id);
                    onDeleteSuccess(id); // Truyền id của sản phẩm đã xóa
                    notification.success({
                        message: 'Xóa sản phẩm thành công',
                        description: result.message,
                    });
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

    const handleEdit = (productId: number) => {
        setSelectedProductId(productId);
        setIsEditModalVisible(true);
    };


    // Xử lý khi bấm vào nút Sync Data (hiện giờ là nút mở modal OffChain)
    const handleOpenOffChainModal = () => {
        setVisible(true); // Mở modal OffChain
    };

    const handleClose = () => {
        setVisible(false); // Đóng modal
    };

    return (
        <>
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
                <div style={{ display: 'flex', marginBottom: '10px', alignItems: 'center' }}>
                    {/* Nút Sync Data bên trái */}
                    {/* Nút thông thường để mở modal OffChain */}
                    <Button
                        onClick={handleOpenOffChainModal} // Mở modal OffChain khi click
                        style={{
                            backgroundColor: '#faad14', // Màu sắc của nút
                            color: '#fff',
                        }}
                    >
                        Xem Off-Chain
                    </Button>

                    {/* Hiển thị ProductOffChainCard khi nút được click */}
                    <ProductOffChainCard
                        id={product.id}
                        visible={visible} // Điều khiển mở/đóng modal OffChain
                        onClose={handleClose} // Đóng modal khi người dùng bấm vào Close
                    />

                    {/* Container cho các nút Edit và Delete bên phải */}
                    <Button type="primary" onClick={() => handleEdit(product.id)}>
                        <EditOutlined />
                    </Button>
                    <Button type="default" danger onClick={() => handleDelete(product.id)}>
                        <DeleteOutlined />
                    </Button>
                </div>

                {/* Nội dung hiển thị trong card */}
                <ImageDisplay imagecids={product.imagecids} />
                <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px' }}>
                    <strong>Creator:</strong>
                    <span style={{ marginLeft: '5px', fontWeight: 'normal' }}>
                        <FormatAndCopyHash hash={product.creater} />
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
