/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import { Button, Table, notification, Spin, Modal, Form, Input } from "antd";
import { getAllUsers, updateUser, deleteUser } from '@/api/users'; // Đường dẫn tới file users.ts
import { UpdateUser } from '@/components/utils/interfaces';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'; // Import icons

const UserTable = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null); // Để lưu thông tin người dùng hiện tại
    const [formData, setFormData] = useState<UpdateUser | null>(null);

    // Hàm để lấy thông tin người dùng khi component mount
    const fetchUserData = async () => {
        try {
            const data = await getAllUsers(); // Lấy danh sách người dùng
            setUsers(data);
        } catch (error) {
            console.error('Error fetching user data:', error);
            notification.error({ message: 'Failed to load user data' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    // Hàm để xử lý cập nhật thông tin người dùng
    const handleUpdate = async () => {
        if (!formData || !currentUser) return; // Kiểm tra dữ liệu hợp lệ
        try {
            await updateUser(currentUser.user_id, formData);
            notification.success({ message: 'User updated successfully!' });
            fetchUserData(); // Cập nhật lại dữ liệu sau khi thay đổi
            setVisible(false); // Đóng modal
        } catch (error) {
            console.error('Error updating user:', error);
            notification.error({ message: 'Failed to update user' });
        }
    };

    // Hàm để xử lý xóa người dùng
    const handleDelete = (userId: string) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this user?',
            onOk: async () => {
                try {
                    await deleteUser(userId);
                    notification.success({ message: 'User deleted successfully!' });
                    fetchUserData(); // Cập nhật lại dữ liệu sau khi xóa
                } catch (error) {
                    console.error('Error deleting user:', error);
                    notification.error({ message: 'Failed to delete user' });
                }
            },
        });
    };

    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text: any, record: any) => (
                <>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => {
                            setCurrentUser(record);
                            setFormData({ email: record.email, password: '' }); // Set giá trị ban đầu
                            setVisible(true); // Mở modal
                        }}
                        type="primary"
                        style={{ marginRight: 8 }}
                    />
                    <Button
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.user_id)}
                        type="default"
                        danger // Đánh dấu nút xóa là nguy hiểm
                    />
                </>
            ),
        },
    ];

    const handleOk = () => {
        handleUpdate(); // Gọi hàm cập nhật khi nhấn OK trong modal
    };

    const handleCancel = () => {
        setVisible(false); // Đóng modal khi nhấn Cancel
    };

    if (loading) {
        return <Spin size="large" />; // Hiển thị loading khi đang fetch data
    }

    return (
        <>
            <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20
            }}>
                <span>Manager Users</span>
                <Button>Create User</Button>
            </div>
            <Table
                bordered
                dataSource={users}
                columns={columns}
                rowKey="user_id"
            />


            <Modal
                title="Update User Information"
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Update"
                cancelText="Cancel"
            >
                {/* Form cập nhật thông tin người dùng */}
                <Form layout="vertical">
                    <Form.Item
                        label="Email"
                        required
                    >
                        <Input
                            type="email"
                            value={formData?.email || ''}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="Enter email"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        required
                    >
                        <Input
                            type="password"
                            value={formData?.password || ''}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="Enter password"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default UserTable;
