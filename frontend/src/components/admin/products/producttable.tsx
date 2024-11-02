/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect, useState } from 'react';
import { Button } from 'antd';
import { GetProductOffChain, } from '@/components/utils/interfaces';
import { ProductList } from './product';
import ProductForm from './productmodal';
import { getAllProductOffChain, getAllProductOnChain } from '@/api/product';

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

    const handleProductDeleted = (productId: string) => {
        setProducts((prevProducts) => prevProducts.filter(product => product.id !== productId)); // Cập nhật danh sách sau khi xóa
    };



    // Tải dữ liệu sản phẩm ban đầu khi component lần đầu render
    useEffect(() => {
        const fetchInitialProducts = async () => {
            const data = await getAllProductOffChain(); // Gọi hàm để lấy dữ liệu off-chain

            // Kiểm tra xem có dữ liệu không
            if (data && data.product_ids && data.product_ids.length > 0) {
                setProducts(data.product_ids.map((id: string) => ({ id }))); // Chuyển đổi dữ liệu từ backend
            } else {
                // Nếu không có dữ liệu, gọi hàm để lấy dữ liệu on-chain
                const onChainData = await getAllProductOnChain();
                setProducts(onChainData.product_ids.map((id: string) => ({ id }))); // Chuyển đổi dữ liệu từ blockchain
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

            {/* Truyền products và hàm xóa xuống ProductList */}
            <ProductList
                products={products}
                onProductDeleted={handleProductDeleted}

            />
            <ProductForm
                isOpen={isModalOpen}
                onClose={handleCancel}
                onProductCreated={handleProductCreated}
            />
        </>
    );
};

export default ProductTable;
