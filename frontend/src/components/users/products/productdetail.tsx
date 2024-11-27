/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { deleteProduct, getProductOnChain } from '@/api/product';
import { ProductOffChainCard } from '@/components/admin/products/productoffchain';
import FormatAndCopyHash from '@/components/componentspage/hash';
import { ImageDisplay } from '@/components/componentspage/image';
import { DeleteOutlined, EditOutlined, HistoryOutlined, ShoppingCartOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Card, Col, message, Modal, notification, Row, Spin } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';



interface ProductOnChainCardProps {
    id: number;
    onDeleteSuccess: (tokenId: number) => void;
}
export const ProductDetail: React.FC<ProductOnChainCardProps> = ({ id, onDeleteSuccess }) => {
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


    if (loading) {
        return <Spin size="large" />; // Hiển thị loading
    }

    if (error) {
        return <div>{error}</div>; // Hiển thị thông báo lỗi
    }



    // Xử lý khi bấm vào nút Sync Data (hiện giờ là nút mở modal OffChain)
    const handleOpenOffChainModal = () => {
        setVisible(true); // Mở modal OffChain
    };

    const handleClose = () => {
        setVisible(false); // Đóng modal
    };




    const handleCart = (
        productId: number,
        name: string,
        price: number,
        availableQuantity: number
    ) => {
        // Lấy danh sách giỏ hàng hiện tại từ localStorage
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');

        // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
        const productIndex = cart.findIndex((item: { id: number }) => item.id === productId);

        if (productIndex === -1) {
            // Nếu chưa tồn tại, thêm sản phẩm mới vào giỏ hàng
            cart.push({
                id: productId,
                name,
                price,
                quantity: 1, // Thêm với số lượng ban đầu là 1
                availableQuantity, // Lưu số lượng tồn kho để kiểm tra sau
            });
            message.success('Product added to cart!');
        } else {
            // Nếu đã tồn tại, kiểm tra số lượng
            const existingProduct = cart[productIndex];
            if (existingProduct.quantity < existingProduct.availableQuantity) {
                existingProduct.quantity += 1; // Tăng số lượng thêm 1
                message.info('Product quantity updated!');
            } else {
                message.warning('Cannot add more than available quantity!');
            }
        }

        // Cập nhật lại giỏ hàng trong localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
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
                    <Button
                        onClick={handleOpenOffChainModal} // Mở modal OffChain khi click
                        style={{
                            backgroundColor: '#faad14', // Màu sắc của nút
                            color: '#fff',
                            width: '150px', // Đặt cùng chiều rộng
                            height: '40px', // Đặt cùng chiều cao
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        Transactions <HistoryOutlined />
                    </Button>

                    {/* Hiển thị ProductOffChainCard khi nút được click */}
                    <ProductOffChainCard
                        id={product.id}
                        visible={visible} // Điều khiển mở/đóng modal OffChain
                        onClose={handleClose} // Đóng modal khi người dùng bấm vào Close
                    />

                    {/* Nút Cart Shopping bên phải */}
                    <Button
                        type="default"
                        onClick={() => handleCart(product.id, product.name, product.price, product.quantity)}
                        style={{
                            backgroundColor: '#28a745',
                            color: '#fff',
                            width: '150px', // Đặt cùng chiều rộng
                            height: '40px', // Đặt cùng chiều cao
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <ShoppingCartOutlined />
                    </Button>
                </div>


                {/* Nội dung hiển thị trong card */}
                <ImageDisplay imagecids={product.imagecids} />
                <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', fontSize: '16px', marginBottom: '10px' }}>
                    <strong>Creator:</strong>
                    <span style={{ marginLeft: '5px', fontWeight: 'normal' }}>
                        <FormatAndCopyHash hash={product.creater} />
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', fontSize: '16px', marginBottom: '10px' }}>
                    <strong>Token Id:</strong>
                    <span style={{ marginLeft: '5px', fontWeight: 'normal' }}>
                        {product.id}
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

        </>
    );
};
