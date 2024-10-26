/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, InputNumber, Upload, notification, Table } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { UploadFile } from 'antd/es/upload/interface';
import { createProduct, getAllProducts } from '@/api/product';
import ProductList, { Product } from './productlist';

const ProductTable = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [imageList, setImageList] = useState<UploadFile[]>([]); // New list for images
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [products, setProducts] = useState<Product[]>([]);


    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = await getAllProducts();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            const files = [...fileList, ...imageList].map((file) => file.originFileObj as File);
            const data = await createProduct({
                name: values.name,
                description: values.description,
                price: values.price,
                quantity: values.quantity,
                status: "available",
                files,
            });

            const newProduct: Product = {
                id: data.id,
                transactionHash: data.transactionHash,
                qrcode: data.qrcode,
                create_at: new Date(data.create_at),
                update_at: new Date(data.update_at),
                isDeleted: data.isDeleted,
            };

            notification.success({
                message: 'Product Created',
                description: 'The product has been created successfully!',
            });

            setIsModalOpen(false);
            form.resetFields();
            setFileList([]);
            setImageList([]);
            setProducts(prevProducts => [...prevProducts, newProduct]);
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



    const MAX_SIZE_BYTES = 10 * 1024 * 1024;

    const handleFileChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
        // Kiểm tra số lượng file
        if (newFileList.length > 5) {
            notification.error({
                message: 'Error',
                description: `You can only upload up to 5 files include Files and Images.`,
            });
            return;
        }

        // Kiểm tra tổng kích thước
        const totalSize = newFileList.reduce((total, file) => total + (file.size || 0), 0);
        if (totalSize > MAX_SIZE_BYTES) {
            notification.error({
                message: 'Error',
                description: `Total file size include Files and Images must be less than 10 MB.`,
            });
            return;
        }

        setFileList(newFileList.slice(0, 5 - imageList.length));
    };

    const handleImageChange = ({ fileList: newImageList }: { fileList: UploadFile[] }) => {
        // Kiểm tra số lượng file
        if (newImageList.length > 5) {
            notification.error({
                message: 'Error',
                description: `You can only upload up to 5 files include Files and Images.`,
            });
            return;
        }

        // Kiểm tra tổng kích thước
        const totalSize = newImageList.reduce((total, file) => total + (file.size || 0), 0);
        if (totalSize > MAX_SIZE_BYTES) {
            notification.error({
                message: 'Error',
                description: `Total file size include Files and Images must be less than 10 MB.`,
            });
            return;
        }

        setImageList(newImageList.slice(0, 5 - fileList.length));
    };


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



            <ProductList products={products} loading={loading} /> {/* Cung cấp props cần thiết */}


            <Modal
                title="Create New Product"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                confirmLoading={loading}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                            { required: true, message: 'Please input the product name!' },
                            {
                                pattern: /^[A-Za-z\s]+$/,
                                message: 'Only letters and spaces are allowed!',
                            },
                        ]}
                        style={{ marginBottom: 16 }}
                        labelCol={{ style: { fontWeight: 'bold', color: '#4CAF50', fontSize: '16px' } }} // Inline CSS cho label
                    >
                        <Input style={{ borderRadius: 4, padding: '8px 12px' }} />
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
                        <Input.TextArea style={{ borderRadius: 4, padding: '8px 12px' }} rows={3} />
                    </Form.Item>
                    <Form.Item
                        label="Price"
                        name="price"
                        rules={[
                            { required: true, message: 'Please input the product price!' },
                            {
                                type: 'number',
                                min: 0,
                                transform: (value) => Number(value),
                                message: 'Price must be a positive number!',
                            },
                        ]}
                        style={{ marginBottom: 16 }}
                        labelCol={{ style: { fontWeight: 'bold', color: '#4CAF50', fontSize: '16px' } }} // Inline CSS cho label
                    >
                        <InputNumber min={0} style={{ width: '100%', borderRadius: 4, padding: '8px 12px' }} />
                    </Form.Item>
                    <Form.Item
                        label="Quantity"
                        name="quantity"
                        rules={[
                            { required: true, message: 'Please input the product quantity!' },
                            {
                                type: 'number',
                                min: 0,
                                transform: (value) => Number(value),
                                message: 'Quantity must be a positive number!',
                            },
                        ]}
                        style={{ marginBottom: 16 }}
                        labelCol={{ style: { fontWeight: 'bold', color: '#4CAF50', fontSize: '16px' } }} // Inline CSS cho label
                    >
                        <InputNumber min={0} style={{ width: '100%', borderRadius: 4, padding: '8px 12px' }} />
                    </Form.Item>
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
            </Modal>
        </>
    );
};

export default ProductTable;
