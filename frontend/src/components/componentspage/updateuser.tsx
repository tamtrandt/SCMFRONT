import React from "react";
import { Modal, Form, Input } from "antd";
import { ProfileData } from "@/components/utils/interfaces";

interface UpdateProfileModalProps {
    visible: boolean;
    onCancel: () => void;
    onUpdate: (data: Partial<ProfileData>) => Promise<void>;
    profileData: ProfileData | null;
}

const UpdateProfileModal = ({ visible, onCancel, onUpdate, profileData }: UpdateProfileModalProps) => {
    const [form] = Form.useForm();

    React.useEffect(() => {
        if (profileData) {
            form.setFieldsValue({
                username: profileData.username,
                phone: profileData.phone,
                address: profileData.address,
                email: profileData.email,
            });
        }
    }, [profileData, form]);

    const handleOk = async () => {
        const updateUserDto = form.getFieldsValue();
        await onUpdate(updateUserDto);
    };

    return (
        <Modal
            title="Update Information"
            open={visible}
            onOk={handleOk}
            onCancel={onCancel}
            okText="Update"
            cancelText="Cancel"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please enter your username' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please enter your email' }, { type: 'email', message: 'Invalid email format' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please enter your password' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    label="Phone Number"
                    name="phone"
                    rules={[{ required: true, message: 'Please enter your phone number' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Address"
                    name="address"
                    rules={[{ required: true, message: 'Please enter your address' }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateProfileModal;
