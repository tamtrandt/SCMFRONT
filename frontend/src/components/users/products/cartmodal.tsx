/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, InputNumber, message, Popconfirm } from 'antd';
import { DeleteOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { CartItem } from '@/components/utils/interfaces';
import { buyTokens } from '@/api/product';
interface CartModalProps {
    visible: boolean;
    onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ visible, onClose }) => {
    const [cartData, setCartData] = useState<CartItem[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        if (visible) {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            cart.forEach((item: any) => {
                if (!item.availableQuantity || item.availableQuantity < 0) {
                    console.warn(`Invalid availableQuantity for item ${item.id}`);
                }
            });
            setCartData(cart);
            calculateTotalPrice(cart);
        }
    }, [visible]);

    const calculateTotalPrice = (cart: any[]) => {
        const total = cart.reduce(
            (sum: number, item: any) => sum + item.price * item.quantity,
            0
        );
        setTotalPrice(total);
    };

    const handleUpdateQuantity = (id: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            message.error('Quantity must be greater than 0!');
            return;
        }

        const updatedCart = cartData.map((item) => {
            if (item.id === id) {
                if (newQuantity > item.availableQuantity) {
                    message.error(`Only ${item.availableQuantity} items available in stock!`);
                    return item;
                }
                return { ...item, quantity: newQuantity };
            }
            return item;
        });

        setCartData(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        calculateTotalPrice(updatedCart);
    };

    const handleDeleteProduct = (id: number) => {
        const updatedCart = cartData.filter((item: any) => item.id !== id);
        setCartData(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        calculateTotalPrice(updatedCart);
        message.success('Product removed from cart!');
    };

    const handleClearCart = () => {
        localStorage.removeItem('cart');
        setCartData([]);
        setTotalPrice(0);
        message.success('Cart has been cleared!');
    };

    const handleBuy = async () => {
        if (cartData.length === 0) {
            message.error('Your cart is empty!');
            return;
        }

        const tokenIds = cartData.map(item => item.id);
        const amounts = cartData.map(item => item.quantity);
        const totalPrice = cartData.reduce((sum, item) => sum + item.price * item.quantity, 0).toString();

        try {
            await buyTokens(tokenIds, amounts, totalPrice);
            message.success('Purchase successful!');
            localStorage.removeItem('cart');
            setCartData([]);
            setTotalPrice(0);
        } catch (error) {
            console.error('Error during purchase:', error);
            message.error('Purchase failed. Please try again.');
        }
    };

    const columns = [
        {
            title: 'Product ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Price (ETH)',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => `${price.toFixed(2)} ETH`,
        },
        {
            title: 'Quantity',
            key: 'quantity',
            render: (record: any) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Button
                        icon={<MinusOutlined />}
                        size="small"
                        onClick={() => handleUpdateQuantity(record.id, record.quantity - 1)}
                        disabled={record.quantity <= 1}
                    />
                    <InputNumber
                        min={1}
                        max={record.availableQuantity}
                        value={record.quantity}
                        onChange={(value) => {
                            if (value) {
                                handleUpdateQuantity(record.id, value);
                            }
                        }}
                    />
                    <Button
                        icon={<PlusOutlined />}
                        size="small"
                        onClick={() => handleUpdateQuantity(record.id, record.quantity + 1)}
                        disabled={record.quantity >= record.availableQuantity}
                    />
                </div>
            ),
        },
        {
            title: 'Total Price',
            key: 'total',
            render: (record: any) => `${(record.price * record.quantity).toFixed(2)} ETH`,
        },
        {
            title: 'Action',
            key: 'action',
            render: (record: any) => (
                <Popconfirm
                    title="Are you sure you want to delete this product?"
                    onConfirm={() => handleDeleteProduct(record.id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>
            ),
        },
    ];

    return (
        <Modal
            title="Your Cart"
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="clear" danger onClick={handleClearCart}>
                    Clear Cart
                </Button>,
                <Button key="buy" type="primary" onClick={handleBuy}>
                    Buy
                </Button>,
            ]}
            width={800}
        >
            <Table
                dataSource={cartData}
                columns={columns}
                rowKey="id"
                pagination={false}
            />
            <div style={{ textAlign: 'right', marginTop: '20px' }}>
                <strong>Total Price: </strong>
                <span style={{ fontSize: '16px', color: '#1890ff' }}>
                    {totalPrice.toFixed(2)} ETH
                </span>
            </div>
        </Modal>
    );
};

export default CartModal;
