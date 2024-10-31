/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect, useState } from 'react';
import { Button } from 'antd';
import { GetProductOffChain, } from '@/components/utils/interfaces';
import { ProductList } from './product';
import ProductForm from './productmodal';
import { getAllProductOffChain } from '@/api/product';

const ProductTable = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [products, setProducts] = useState<GetProductOffChain[]>([]);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const handleProductCreated = (newProduct: GetProductOffChain) => {
        setProducts((prevProducts) => [newProduct, ...prevProducts]); // Thêm sản phẩm vào cuối mảng
    };

    // Tải dữ liệu sản phẩm ban đầu khi component lần đầu render
    useEffect(() => {
        const fetchInitialProducts = async () => {
            try {
                const data = await getAllProductOffChain();
                setProducts(data.product_ids.map((id: string) => ({ id }))); // Chuyển đổi dữ liệu từ backend
            } catch (error) {
                console.error('Error fetching initial products:', error);
            }
        };

        fetchInitialProducts();
    }, []);

    return (
        <>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20
            }}>
                <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>Manager Products</span>
                <Button onClick={showModal}>New Product</Button>
            </div>

            {/* Truyền products dưới dạng prop */}
            <ProductList products={products} />

            <ProductForm
                isOpen={isModalOpen}
                onClose={handleCancel}
                onProductCreated={handleProductCreated}
            />
        </>
    );
};

export default ProductTable;
