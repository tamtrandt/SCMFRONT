/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { deleteProduct } from '@/api/product';
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
            {/* <Modal
                title="Update Product"
                open={isEditModalVisible}
                onOk={handleEditModalOk}
                onCancel={handleEditModalCancel}
                confirmLoading={loading}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                            { required: true, message: 'Please input the product name!' },
                        ]}
                        style={{ marginBottom: 16 }}
                        labelCol={{ style: { fontWeight: 'bold', color: '#4CAF50', fontSize: '16px' } }} // Inline CSS cho label
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[
                            { required: true, message: 'Please input the product description!' },
                            {
                                validator: (_, value) => {
                                    const wordCount = value ? value.trim().split(/\s+/).length : 0;
                                    if (wordCount > 250) {
                                        return Promise.reject(new Error('Description cannot exceed 250 words!'));
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}
                        style={{ marginBottom: 16 }}
                        labelCol={{ style: { fontWeight: 'bold', color: '#4CAF50', fontSize: '16px' } }} // Inline CSS cho label
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>



                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                label="Price"
                                name="price"
                                rules={[
                                    { required: true, message: 'Please input the product price!' },
                                    {
                                        validator: (_, value) => {
                                            // Kiểm tra xem giá trị có phải là số hay không
                                            if (typeof value !== 'number') {
                                                return Promise.reject(new Error('Price must be a number'));
                                            }
                                            // Kiểm tra nếu giá nhỏ hơn 0
                                            if (value < 0) {
                                                return Promise.reject(new Error('Price must be a positive number'));
                                            }
                                            // Kiểm tra định dạng để đảm bảo giá có tối đa hai chữ số thập phân
                                            if (!/^\d+(\.\d{1,2})?$/.test(value.toString())) {
                                                return Promise.reject(new Error('Price must be a valid number with up to two decimal places'));
                                            }
                                            return Promise.resolve();
                                        }
                                    }
                                ]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Quantity"
                                name="quantity"
                                rules={[
                                    { required: true, message: 'Please input the product quantity!' },
                                    {
                                        type: 'integer',
                                        message: 'Quantity must be an integer',
                                    },
                                    {
                                        validator: (_, value) => {
                                            if (value < 0) {
                                                return Promise.reject(new Error('Quantity must be a positive integer'));
                                            }
                                            return Promise.resolve();
                                        }
                                    }
                                ]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item label="Brand" name="brand" rules={[{ required: true, message: 'Please select the brand!' }]}>
                                <Select placeholder="Select Brand">
                                    {Object.values(Brand).map((brand) => (
                                        <Select.Option key={brand} value={brand}>{brand}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Category" name="category">
                                <Select placeholder="Select Type" onChange={(value) => setProductType(value)}>
                                    {['Clothing', 'Shoes', 'Pants'].map(type => (
                                        <Select.Option key={type} value={type}>{type}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item label="Size" name="size" rules={[{ required: true, message: 'Please select the size!' }]}>
                                <Select placeholder="Select Size">
                                    {sizeOptions[productType].map(size => (
                                        <Select.Option key={size} value={size}>{size}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Upload Images (JPG, PNG, JPEG only)"
                        style={{ marginBottom: 16 }}
                        labelCol={{ style: { fontWeight: 'bold', color: '#4CAF50', fontSize: '16px' } }}
                    >
                        <Upload
                            accept=".png,.jpg,.jpeg"
                            multiple
                            fileList={imageList}
                            beforeUpload={(file) => {
                                const isValidSize = file.size <= MAX_SIZE_BYTES;
                                if (!isValidSize) {
                                    notification.error({
                                        message: 'Error',
                                        description: `Each image must be less than 5 MB.`,
                                    });
                                }
                                return isValidSize;
                            }}
                            onChange={handleImageChange}
                        >
                            <Button
                                icon={<UploadOutlined />}
                                style={{
                                    backgroundColor: '#4CAF50',
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    border: 'none',
                                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                Select Images
                            </Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        label="Upload Files (TXT, PDF, DOC only)"
                        style={{ marginBottom: 16 }}
                        labelCol={{ style: { fontWeight: 'bold', color: '#4CAF50', fontSize: '16px' } }}
                    >
                        <Upload
                            accept=".txt,.pdf,.doc"
                            multiple
                            fileList={fileList}
                            beforeUpload={(file) => {
                                const isValidSize = file.size <= MAX_SIZE_BYTES;
                                if (!isValidSize) {
                                    notification.error({
                                        message: 'Error',
                                        description: `Each file must be less than 5 MB.`,
                                    });
                                }
                                return isValidSize;
                            }}
                            onChange={handleFileChange}
                        >
                            <Button
                                icon={<UploadOutlined />}
                                style={{
                                    backgroundColor: '#4CAF50',
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    border: 'none',
                                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                Select Files
                            </Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal> */}
            {isEditModalVisible && selectedProductId && (
                <UpdateModal
                    visible={isEditModalVisible}
                    productId={selectedProductId}
                    onClose={() => setIsEditModalVisible(false)}
                    onUpdate={() => {
                        // Thêm logic cập nhật sau khi chỉnh sửa nếu cần
                        setIsEditModalVisible(false);
                    }}
                />
            )}







        </>
    );
};