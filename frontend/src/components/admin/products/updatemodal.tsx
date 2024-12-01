/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, Upload, Button, notification, Row, Col, UploadFile, List, Checkbox } from 'antd';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { getProductOnChain, updateMetadata, updatePrice, updateQuantity } from '@/api/product';
import { validateFileUpload } from '@/components/utils/functions';
import { Brand, GetProductOnChain, sizeOptions } from '@/components/utils/interfaces';


interface UpdateModalProps {
    visible: boolean;
    productId: number;
    onClose: () => void;
    onUpdateSuccess: () => void;

}

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const UpdateModal: React.FC<UpdateModalProps> = ({ visible, productId, onUpdateSuccess, onClose }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [productType, setProductType] = useState<'Clothing' | 'Shoes' | 'Pants'>('Clothing');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [imageList, setImageList] = useState<UploadFile[]>([]);
    const [productData, setProductData] = useState<GetProductOnChain | null>(null);
    const [selectedCids, setSelectedCids] = useState<string[]>([]);

    useEffect(() => {
        if (productId) {
            getProductOnChain(productId).then((product) => {
                form.setFieldsValue({ ...product, id: productId });
                setProductData(product);
                setProductType(product.category);
            });
        }
    }, [productId, form]);

    const imagecids = form.getFieldValue('imagecids') || [];
    const filecids = form.getFieldValue('filecids') || [];

    const handleEditModalOk = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            const newFiles = [...fileList, ...imageList].map((file) => file.originFileObj as File);
            const formData = new FormData();
            formData.append('id', values.id);
            formData.append('name', values.name);
            formData.append('description', values.description);
            formData.append('price', values.price.toString());
            formData.append('quantity', values.quantity.toString());
            formData.append('brand', values.brand);
            formData.append('category', values.category);
            formData.append('size', values.size);
            formData.append('status', values.status);

            const filteredImageCids = filteredCids(imagecids);
            const filteredFileCids = filteredCids(filecids);
            filteredImageCids.forEach((cid) => formData.append('imagecids', cid));
            filteredFileCids.forEach((cid) => formData.append('filecids', cid));
            newFiles.forEach((file) => formData.append('newFiles', file));

            await updateMetadata(productId, formData);
            onUpdateSuccess();

            notification.success({ message: 'Product updated successfully' });
            onClose();
            form.resetFields();
            setFileList([]);
            setImageList([]);
            setSelectedCids([]);
        } catch (error) {
            console.error('Error updating product:', error);
            notification.error({ message: 'Error updating product', description: 'An error occurred while updating the product.' });
        } finally {
            setLoading(false);
            onClose();
        }
    };

    const handleUpdatePrice = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            const price = values.price.toString();
            await updatePrice(productId, price);

            notification.success({ message: 'Price updated successfully' });
            onUpdateSuccess();
        } catch (error) {
            console.error('Error updating price:', error);
            notification.error({ message: 'Error updating price', description: 'An error occurred while updating the price.' });
        } finally {
            setLoading(false);
            onClose();
        }
    };

    const handleUpdateQuantity = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            await updateQuantity(productId, values.quantity);

            notification.success({ message: 'Quantity updated successfully' });
            onUpdateSuccess();
        } catch (error) {
            console.error('Error updating quantity:', error);
            notification.error({ message: 'Error updating quantity', description: 'An error occurred while updating the quantity.' });
        } finally {
            setLoading(false);
            onClose();
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

    const handleDeleteCid = (cid: string) => {
        setSelectedCids((prev) => {
            if (prev.includes(cid)) {
                return prev.filter((item) => item !== cid);
            } else {
                return [...prev, cid];
            }
        });
    };

    const filteredCids = (cids: string[]) => {
        return cids.filter((cid) => !selectedCids.includes(cid));
    };



    return (
        <Modal
            title="Update Product"
            open={visible}
            onOk={handleEditModalOk}
            onCancel={onClose}
            confirmLoading={loading}
            footer={[
                <Button key="updatePrice" onClick={handleUpdatePrice} style={{ backgroundColor: '#FF9800', color: '#fff' }}>
                    Update Price
                </Button>,
                <Button key="updateQuantity" onClick={handleUpdateQuantity} style={{ backgroundColor: '#3F51B5', color: '#fff' }}>
                    Update Quantity
                </Button>,
                <Button key="update" type="primary" onClick={handleEditModalOk} loading={loading}>
                    Update
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input the product name!' }]}
                    style={{ marginBottom: 16 }}
                    labelCol={{ style: { fontWeight: 'bold', color: '#4CAF50', fontSize: '16px' } }}
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
                            },
                        },
                    ]}
                    style={{ marginBottom: 16 }}
                    labelCol={{ style: { fontWeight: 'bold', color: '#4CAF50', fontSize: '16px' } }}
                >
                    <Input.TextArea rows={3} />
                </Form.Item>

                <Row gutter={24}>
                    <Col span={6}>
                        <Form.Item
                            label="Price"
                            name="price"
                            rules={[
                                { required: true, message: 'Please input the product price!' },
                                {
                                    validator: (_, value) => {
                                        if (typeof value !== 'number' || value < 0) {
                                            return Promise.reject(new Error('Price must be a positive number'));
                                        }
                                        if (!/^\d+(\.\d{1,2})?$/.test(value.toString())) {
                                            return Promise.reject(new Error('Price must have up to two decimal places'));
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                        >
                            <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
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
                                    },
                                },
                            ]}
                        >
                            <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="Collection" name="brand" rules={[{ required: true, message: 'Please select the brand!' }]}>
                            <Select placeholder="Select Brand">
                                {Object.values(Brand).map((brand) => (
                                    <Select.Option key={brand} value={brand}>{brand}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
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
                    <Col span={6}>
                        <Form.Item label="Size" name="size" rules={[{ required: true, message: 'Please select the size!' }]}>
                            <Select placeholder="Select Size">
                                {sizeOptions[productType].map(size => (
                                    <Select.Option key={size} value={size}>{size}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    {/* Labels and delete section */}
                    <Col span={24}>
                        <label style={{ fontSize: '16px', fontWeight: 'normal' }}>
                            Select the images and files you want to <span style={{ fontWeight: 'bold', color: 'red' }}>DELETE</span>
                        </label>
                    </Col>

                    {/* Current Images */}
                    <Col span={12}>
                        <Form.Item label="Current Images" style={{ marginBottom: 16 }}>
                            <List
                                bordered
                                dataSource={imagecids}
                                renderItem={(cid: string) => {
                                    const cleanCid = cid.replace('ipfs://', '');
                                    return (
                                        <List.Item actions={[<Checkbox onChange={() => handleDeleteCid(cid)} />]}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <img
                                                    src={`https://ipfs.io/ipfs/${cleanCid}`}
                                                    alt="preview"
                                                    style={{ width: '100px', height: '100px', marginRight: '10px', objectFit: 'cover' }}
                                                />
                                            </div>
                                        </List.Item>
                                    );
                                }}
                            />
                        </Form.Item>
                    </Col>

                    {/* Current Files */}
                    <Col span={12}>
                        <Form.Item label="Current Files" style={{ marginBottom: 16 }}>
                            <List
                                bordered
                                dataSource={filecids}
                                renderItem={(cid: string) => {
                                    const cleanCid = cid.replace('ipfs://', '');
                                    return (
                                        <List.Item actions={[<Checkbox onChange={() => handleDeleteCid(cid)} />]}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <a
                                                    href={`https://ipfs.io/ipfs/${cleanCid}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ marginRight: '10px' }}
                                                >
                                                    View File
                                                </a>
                                            </div>
                                        </List.Item>
                                    );
                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                {/* Upload Images */}
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
                                    description: 'Each image must be less than 5 MB.',
                                });
                            }
                            return isValidSize;
                        }}
                        onChange={handleImageChange}
                    >
                        <Button icon={<UploadOutlined />} style={{ backgroundColor: '#4CAF50', color: '#fff' }}>
                            Select Images
                        </Button>
                    </Upload>
                </Form.Item>

                {/* Upload Files */}
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
                                    description: 'Each file must be less than 5 MB.',
                                });
                            }
                            return isValidSize;
                        }}
                        onChange={handleFileChange}
                    >
                        <Button icon={<UploadOutlined />} style={{ backgroundColor: '#4CAF50', color: '#fff' }}>
                            Select Files
                        </Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
};