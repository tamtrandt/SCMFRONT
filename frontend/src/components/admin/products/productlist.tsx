/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useState } from 'react';
import { Button, Card, Col, Row, Pagination, message, Input } from 'antd';
import { DoubleLeftOutlined, DoubleRightOutlined, LeftOutlined, LeftSquareTwoTone, RightOutlined, RightSquareTwoTone, } from '@ant-design/icons';

export interface Product {
    id: string;
    transactionHash: string;
    qrcode: string[];
    create_at: Date;
    update_at: Date;
    isDeleted: boolean;
}

interface ProductListProps {
    products: Product[];
    loading: boolean; // Thêm thuộc tính loading vào đây
}

const ProductList: React.FC<ProductListProps> = ({ products, loading }) => {

    // Component để hiển thị nhiều mã QR
    const QRDisplay: React.FC<{ qrcodes: string[] }> = ({ qrcodes }) => {
        const [currentIndex, setCurrentIndex] = useState(0);

        const nextQR = () => {
            if (currentIndex < qrcodes.length - 1) {
                setCurrentIndex(currentIndex + 1);
            }
        };

        const prevQR = () => {
            if (currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
            }
        };

        return (
            <div style={{ textAlign: 'center', marginBottom: 10, position: 'relative' }}>
                <Button
                    onClick={prevQR}
                    disabled={currentIndex === 0}
                    style={{
                        position: 'absolute',
                        left: '-25px', // Điều chỉnh khoảng cách sang trái
                        top: '50%',
                        transform: 'translateY(-50%)', // Căn giữa theo chiều dọc
                        height: '60px', // Chiều cao nút
                        width: '60px', // Chiều rộng nút
                        border: 'none', // Bỏ viền
                        backgroundColor: 'transparent', // Nền trong suốt
                        padding: 0, // Bỏ padding
                        cursor: 'pointer', // Con trỏ chuột
                        fontSize: '24px', // Kích thước chữ lớn cho dễ nhìn                      
                    }}
                    icon={<DoubleLeftOutlined />} // Sử dụng icon mũi tên trái với màu và độ đậm
                />
                <img
                    src={qrcodes[currentIndex]}
                    alt="QR Code"
                    style={{ width: 230, height: 230, marginBottom: 10 }}
                />
                <Button
                    onClick={nextQR}
                    disabled={currentIndex === qrcodes.length - 1}
                    style={{
                        position: 'absolute',
                        right: '-25px', // Điều chỉnh khoảng cách sang phải
                        top: '50%',
                        transform: 'translateY(-50%)', // Căn giữa theo chiều dọc
                        height: '60px', // Chiều cao nút
                        width: '60px', // Chiều rộng nút
                        border: 'none', // Bỏ viền
                        backgroundColor: 'transparent', // Nền trong suốt
                        padding: 0, // Bỏ padding
                        cursor: 'pointer', // Con trỏ chuột
                        fontSize: '28px', // Kích thước chữ lớn cho dễ nhìn
                    }}
                    icon={<DoubleRightOutlined />} // Sử dụng icon mũi tên phải
                />
            </div>
        );

    };

    //Xu Ly HASH
    const formatTransactionHash = (hash: string) => {
        if (!hash) return ''; // Kiểm tra nếu hash không tồn tại
        const start = hash.slice(0, 5); // Lấy 5 ký tự đầu
        const end = hash.slice(-5); // Lấy 5 ký tự cuối
        return `${start}...${end}`; // Kết hợp và thêm "..."
    };


    const [currentPage, setCurrentPage] = useState(1);
    const [inputPage, setInputPage] = useState<string>('');
    const pageSize = 4; // Số sản phẩm trên mỗi trang

    // Tính toán số sản phẩm cần hiển thị trên trang hiện tại
    const paginatedProducts = products.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const totalPages = Math.ceil(products.length / pageSize);

    const handlePageChange = (page: any) => {
        setCurrentPage(page);
    };

    const handleGoToPage = () => {
        const pageNumber = Number(inputPage);
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            setInputPage(''); // Reset ô nhập khi nhảy đến trang
        } else {
            alert(`Please enter a valid page number between 1 and ${totalPages}`);
        }
    };




    return (
        <>
            <Row gutter={24}>
                {loading ? (
                    <Col style={{ textAlign: 'center', width: '100%' }}>
                        <p>Loading...</p>
                    </Col>
                ) : (
                    paginatedProducts.map((product) => (
                        <Col key={product.id} span={6} style={{ display: 'flex', justifyContent: 'center' }}>
                            <Card
                                bordered={false}
                                style={{
                                    height: '500px',
                                    width: '300px',
                                    padding: '5px',
                                    border: '6px solid red',
                                    borderRadius: '10px',
                                    margin: '5px',
                                }}
                            >
                                <QRDisplay qrcodes={product.qrcode} />
                                <p style={{ fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    <strong>Product ID:</strong> {formatTransactionHash(product.id)}
                                </p>
                                <p style={{ fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    <strong>Transaction Hash:</strong> {formatTransactionHash(product.transactionHash)}
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
                            </Card>
                        </Col>
                    ))
                )}
            </Row>


            {/* Hiển thị thông tin phân trang */}
            <div style={{
                textAlign: 'center',
                marginTop: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{ marginRight: '20px' }}
                >

                    {"<<<"}
                </Button>
                <p style={{ margin: '0 20px', fontWeight: 'bold' }}>
                    {currentPage}/{totalPages}
                </p>
                <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{ marginLeft: '20px' }}
                > {">>>"}

                </Button>

                {/* Go to page input */}
                <div style={{ marginLeft: '20px' }}>
                    <Input
                        type="number"
                        value={inputPage}
                        onChange={(e) => {
                            const value = e.target.value;
                            // Kiểm tra nếu value là số nguyên dương hoặc chuỗi rỗng
                            if (value === '' || /^[1-9]\d*$/.test(value)) {
                                setInputPage(value);
                            }
                        }}
                        placeholder="Page"
                        style={{
                            width: '70px',
                            marginRight: '8px',
                            borderRadius: '4px',
                            border: '1px solid #d9d9d9'
                        }}
                    />
                    <Button
                        onClick={handleGoToPage}
                        style={{ borderRadius: '4px', backgroundColor: '#4caf50', color: '#fff' }}
                    >
                        Go
                    </Button>
                </div>
            </div>
        </>
    );


}

export default ProductList;



