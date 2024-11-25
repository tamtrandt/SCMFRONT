/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// ProductForm.tsx
'use client'
import { useState } from 'react';
import { Button, Modal, Form, Input, InputNumber, Upload, notification, Row, Col, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { UploadFile } from 'antd/es/upload/interface';
import { createProduct } from '@/api/product';
import { Brand, sizeOptions } from '@/components/utils/interfaces';
import { MAX_SIZE_BYTES, validateFileUpload } from '@/components/utils/functions';

interface ProductFormProps {
    isOpen: boolean;
    onClose: () => void;
    onProductCreated: (data: any) => void;

}

const ProductForm: React.FC<ProductFormProps> = ({ isOpen, onClose, onProductCreated }) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [imageList, setImageList] = useState<UploadFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [productType, setProductType] = useState<'Clothing' | 'Shoes' | 'Pants'>('Clothing');

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
                brand: values.brand,
                category: values.category,
                size: values.size,
                files,
            });

            onProductCreated(data);
            notification.success({
                message: 'Product Created',
                description: 'The product has been created successfully!',
            });

            onClose();
            form.resetFields();
            setFileList([]);
            setImageList([]);
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

    const handleFileChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
        const validatedList = validateFileUpload(newFileList, imageList, 5, notification);
        if (validatedList) {
            setFileList(validatedList);
        }
    };

    const handleImageChange = ({ fileList: newImageList }: { fileList: UploadFile[] }) => {
        const validatedList = validateFileUpload(newImageList, fileList, 5, notification);
        if (validatedList) {
            setImageList(validatedList);
        }
    };

    return (
        <Modal
            title="Create New Product"
            open={isOpen}
            onOk={handleOk}
            onCancel={onClose}
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
                            <InputNumber min={0} style={{ width: '100%' }} step={0.01} />
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
        </Modal>
    );
};

export default ProductForm;
