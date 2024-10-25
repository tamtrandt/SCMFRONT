/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, InputNumber, Upload, notification, Table } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { UploadFile } from 'antd/es/upload/interface';
import { createProduct, getAllProducts } from '@/api/product';
import ProductList, { Product } from './productlist';
// Import hàm createProduct
const ProductTable = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [products, setProducts] = useState<Product[]>([]); // State cho danh sách sản phẩm


    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Transaction Hash',
            dataIndex: 'transactionHash',
            key: 'transactionHash',
        },
        {
            title: 'QR Codes',
            dataIndex: 'qrcode',
            key: 'qrcode',
            render: (qrcodes: string[]) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {qrcodes.map((code, index) => (
                        <img
                            key={index}
                            src={code}
                            alt={`QR Code ${index + 1}`}
                            style={{ width: 100, height: 100 }} // Tăng kích thước QR code
                        />
                    ))}
                </div>
            ),
        },
        {
            title: 'Created At',
            dataIndex: 'create_at',
            key: 'create_at',
            render: (text: string) => new Date(text).toLocaleString(), // Format thời gian
        },
        {
            title: 'Updated At',
            dataIndex: 'update_at',
            key: 'update_at',
            render: (text: string) => new Date(text).toLocaleString(), // Format thời gian
        },
        {
            title: 'Is Deleted',
            dataIndex: 'isDeleted',
            key: 'isDeleted',
            render: (text: boolean) => (text ? 'Yes' : 'No'), // Hiển thị Yes/No cho isDeleted
        },
    ];

    useEffect(() => {
        // Gọi API khi component được render
        const fetchProducts = async () => {
            setLoading(true); // Bật trạng thái loading
            try {
                const data = await getAllProducts(); // Gọi API để lấy dữ liệu
                setProducts(data); // Cập nhật state với dữ liệu trả về
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false); // Tắt trạng thái loading
            }
        };

        fetchProducts(); // Gọi hàm fetchProducts
    }, []);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            // Chuyển đổi fileList sang dạng File[]
            const files = fileList.map((file) => file.originFileObj as File);

            // Gọi hàm createProduct
            const data = await createProduct({
                name: values.name,
                description: values.description,
                price: values.price,
                quantity: values.quantity,
                status: values.status,
                files: files,
            });

            // Dữ liệu trả về từ backend
            const newProduct: Product = {
                id: data.id,
                transactionHash: data.transactionHash,
                qrcode: data.qrcode,
                create_at: new Date(data.create_at),
                update_at: new Date(data.update_at),
                isDeleted: data.isDeleted,
            };

            // Thông báo thành công
            notification.success({
                message: 'Product Created',
                description: 'The product has been created successfully!',
            });
            console.log(data);

            // Reset modal và bảng
            setIsModalOpen(false);
            form.resetFields();
            setFileList([]);

            // Cập nhật danh sách sản phẩm mới
            setProducts(prevProducts => [...prevProducts, newProduct]); // Thêm sản phẩm mới vào danh sách hiện tại
        } catch (error) {
            console.error('Error creating product:', error);
            notification.error({
                message: 'Error',
                description: 'Failed to create product. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleFileChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
        setFileList(newFileList.slice(0, 10)); // Giới hạn tối đa 10 files
    };
    // Định nghĩa các cột cho bảng



    return (
        <>
            <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20
            }}>
                <span>Manager Products</span>
                <Button onClick={showModal}>New Product</Button>
            </div>
            {/* Hiển thị bảng với dữ liệu */}
            <Table
                columns={columns} // Truyền vào các cột đã định nghĩa
                dataSource={products} // Truyền vào dữ liệu từ API
                rowKey="id" // Đặt `id` làm khóa cho mỗi hàng
                loading={loading} // Hiển thị loading khi dữ liệu đang tải
            />

            <Modal
                title="Create New Product"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                confirmLoading={loading} // Hiển thị loading khi đang submit form
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input the product name!' }]} >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please input the product description!' }]} >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Price"
                        name="price"
                        rules={[{ required: true, message: 'Please input the product price!' }]} >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        label="Quantity"
                        name="quantity"
                        rules={[{ required: true, message: 'Please input the product quantity!' }]} >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        label="Status"
                        name="status"
                        rules={[{ required: true, message: 'Please input the product status!' }]} >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Upload Files">
                        <Upload
                            multiple
                            fileList={fileList}
                            beforeUpload={() => false} // Tắt upload ngay lập tức
                            onChange={handleFileChange}
                        >
                            <Button icon={<UploadOutlined />}>Select Files (max: 10)</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default ProductTable;