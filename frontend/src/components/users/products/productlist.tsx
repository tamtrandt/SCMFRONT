/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import { Button, Col, notification, Row, Spin } from 'antd';
import { getAllProductOnChain, getProductOnChain } from '@/api/product';
import { PaginationComponent } from '@/components/componentspage/pagination';
import { ProductOnChainCard } from '@/components/admin/products/productonchain';
import { ProductDetail } from './productdetail';



const ProductList = () => {
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
    const handleTokenIdDelete = (tokenId: number) => {
        // Xóa sản phẩm khỏi danh sách products
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== tokenId));

        // Cập nhật lại paginatedProducts
        setPaginatedProducts((prevProducts) => prevProducts.filter((product) => product.id !== tokenId));
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
                <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>Marketplace</span>
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
                                        <ProductDetail id={product.id} onDeleteSuccess={handleTokenIdDelete} />
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


        </>
    );
};

export default ProductList;