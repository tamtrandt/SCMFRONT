/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import { Button, Col, notification, Row, Spin } from 'antd';
import { GetProductOnChain } from '@/components/utils/interfaces';
import { getAllProductOnChain, getProductOnChain } from '@/api/product';
import ProductForm from './productmodal';
import { ProductOnChainCard } from './productonchain';
import { PaginationComponent } from '@/components/componentspage/pagination';



const ProductTable = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [products, setProducts] = useState<any[]>([]); // Danh sách sản phẩm
    const [loading, setLoading] = useState(false);
    const [paginatedProducts, setPaginatedProducts] = useState<any[]>([]); // Sản phẩm hiển thị theo trang

    // Mở Modal
    const showModal = () => {
        setIsModalOpen(true);
    };

    // Đóng Modal
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // Hàm xử lý khi tạo sản phẩm thành công
    const handleProductCreated = async (tokenId: number) => {
        try {
            // Fetch thông tin chi tiết của sản phẩm mới tạo từ tokenId
            const newProduct = await getProductOnChain(tokenId);

            // Cập nhật danh sách sản phẩm (không fetch lại tất cả)
            setProducts((prevProducts) => [...prevProducts, newProduct]);

            // Cập nhật danh sách phân trang
            setPaginatedProducts((prevProducts) => {
                const updatedProducts = [...prevProducts, newProduct];
                return updatedProducts.slice(-4); // Hiển thị 4 sản phẩm cuối
            });

            notification.success({
                message: 'Product Added',
                description: 'A new product has been added successfully!',
            });
        } catch (error) {
            console.error('Error adding new product:', error);
            notification.error({
                message: 'Error',
                description: 'Failed to add the new product to the list.',
            });
        }
    };

    // Hàm fetch tất cả sản phẩm từ on-chain
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await getAllProductOnChain();
            if (data?.product_ids?.length > 0) {
                const productDetails = await Promise.all(
                    data.product_ids.map(async (tokenId: number) => {
                        const product = await getProductOnChain(tokenId);
                        return product;
                    })
                );
                setProducts(productDetails); // Lưu danh sách sản phẩm chi tiết
                setPaginatedProducts(productDetails.slice(0, 4)); // Mặc định hiển thị 4 sản phẩm
            } else {
                setProducts([]);
                setPaginatedProducts([]);
            }
        } catch (error) {
            notification.error({
                message: 'Lỗi khi tải sản phẩm',
                description: 'Không thể tải danh sách sản phẩm từ on-chain.',
            });
        } finally {
            setLoading(false);
        }
    };

    // Lấy lại danh sách sản phẩm khi component load
    useEffect(() => {
        fetchProducts();
    }, []);

    // Hàm phân trang
    const handlePageChange = (paginatedProducts: any[]) => {
        setPaginatedProducts(paginatedProducts);
    };

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 20,
                }}
            >
                <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>Manager Products</span>
                <Button onClick={showModal}>New Product</Button>
            </div>

            {loading ? (
                <Spin size="large" />
            ) : (
                <div>
                    {products.length === 0 ? (
                        <p>No products found.</p>
                    ) : (
                        <>
                            <Row gutter={[24, 24]}>
                                {paginatedProducts.map((product) => (
                                    <Col span={6} key={product.id}>
                                        {/* Hiển thị từng sản phẩm */}
                                        <ProductOnChainCard id={product.id} />
                                    </Col>
                                ))}
                            </Row>
                            {/* Component phân trang */}
                            <PaginationComponent
                                products={products}
                                pageSize={4} // Mỗi trang sẽ hiển thị 4 sản phẩm
                                onPageChange={handlePageChange}
                            />
                        </>
                    )}
                </div>
            )}

            {/* Modal tạo sản phẩm */}
            <ProductForm
                isOpen={isModalOpen}
                onClose={handleCancel}
                onProductCreated={handleProductCreated}
            />
        </>
    );
};

export default ProductTable;