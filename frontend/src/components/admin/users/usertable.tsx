/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import { Button, Table, notification, Spin, Modal, Form, Input, Select, message, } from "antd";
import { getAllUsers, deleteUser, createUser, updateUser } from '@/api/users';
import { UpdateUser } from '@/components/utils/interfaces';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import UpdateProfileModal from '@/components/componentspage/updateuser';
import FormatAndCopyHash from '@/components/componentspage/hash';
import Title from 'antd/es/typography/Title';


const UserTable = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [visibleCreateModal, setVisibleCreateModal] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [createFormData, setCreateFormData] = useState<{ email: string; password: string; role: string }>({ email: '', password: '', role: 'customer' }); // State cho form tạo mới
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('ascend');
    const [filterRole, setFilterRole] = useState('');
    const [isActiveFilter, setIsActiveFilter] = useState('');

    const handleSearch = (value: any) => {
        setSearchTerm(value);
    };

    const filteredUsers = users
        .filter(user =>
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.user_id && user.user_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.phone && user.phone.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .filter(user => {
            const roleMatch = !filterRole || user.role === filterRole;

            const isActiveMatch =
                (isActiveFilter === "" || isActiveFilter === "all") ||
                (isActiveFilter === "active" && user.isactive) ||
                (isActiveFilter === "not-active" && !user.isactive);

            return roleMatch && isActiveMatch;
        })
        .sort((a, b) => {
            switch (sortOrder) {
                case "abcAsc":
                    return (a.username || "").localeCompare(b.username || "");
                case "abcDesc":
                    return (b.username || "").localeCompare(a.username || "");
                case "createdAtAsc":
                    return +new Date(a.create_at as string) - +new Date(b.create_at as string);
                case "createdAtDesc":
                    return +new Date(b.create_at as string) - +new Date(a.create_at as string);
                default:
                    return 0;
            }

        });

    const fetchUserData = async () => {
        try {
            const data = await getAllUsers();
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

    const handleUpdate = async (updateData: Partial<UpdateUser>) => {
        if (!currentUser) return;

        try {
            const response = await updateUser(currentUser.user_id, updateData);
            message.success(response.message);
            fetchUserData();
            setIsUpdateModalOpen(false);
        } catch (err) {
            message.error(err instanceof Error ? err.message : "Update failed");
        }
    };

    const handleCreate = async () => {
        try {
            await createUser(createFormData);
            notification.success({ message: 'User created successfully!' });
            fetchUserData();
            setVisibleCreateModal(false);
            setCreateFormData({ email: '', password: '', role: '' });
        } catch (error) {
            console.error('Error creating user:', error);
            notification.error({ message: error instanceof Error ? error.message || 'Failed to create user' : 'An unknown error occurred' });
        }
    };

    const handleDelete = async (userId: string) => {
        const storedUserData = localStorage.getItem("user_data");
        const storedUser = storedUserData ? JSON.parse(storedUserData) : null;
        const currentUserId = storedUser?.sub;

        const isCurrentUser = userId === currentUserId;

        if (isCurrentUser) {
            Modal.confirm({
                title: 'Are you sure you want to delete your own account?',
                content: 'Deleting your own account will log you out and remove all your data.',
                onOk: async () => {
                    try {
                        await deleteUser(userId);
                        Cookies.remove("access_token");
                        localStorage.removeItem("user_data");
                        notification.success({ message: 'Your account has been deleted successfully!' });
                        router.push("/auth/login");
                    } catch (error) {
                        console.error('Error deleting user:', error);
                        notification.error({ message: 'Failed to delete user' });
                    }
                },
            });
        } else {
            Modal.confirm({
                title: 'Are you sure you want to delete this user?',
                onOk: async () => {
                    try {
                        await deleteUser(userId);
                        notification.success({ message: 'User deleted successfully!' });
                        fetchUserData();
                    } catch (error) {
                        console.error('Error deleting user:', error);
                        notification.error({ message: 'Failed to delete user' });
                    }
                },
            });
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'user_id',
            key: 'user_id',
            render: (user_id: string) => <FormatAndCopyHash hash={user_id} />,
        },
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
            title: 'Active',
            dataIndex: 'isactive',
            key: 'isactive',
            render: (isActive: boolean) => (isActive ? 'Active' : 'Not Active'),
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
                            setIsUpdateModalOpen(true);
                        }}
                        type="primary"
                        style={{ marginRight: 8 }}
                    />
                    <Button
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.user_id)}
                        type="default"
                        danger
                    />
                </>
            ),
        },
    ];

    const handleOkCreate = () => {
        handleCreate();
    };

    const handleCancelCreate = () => {
        setVisibleCreateModal(false);
        setCreateFormData({ email: '', password: '', role: 'customer' });
    };

    if (loading) {
        return <Spin size="large" />;
    }

    return (
        <>
            <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20
            }}>
                <span>Manager Users</span>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Input.Search
                        placeholder="Search "
                        onSearch={handleSearch}
                        style={{ width: 200, marginRight: 20 }}
                    />
                    <Select
                        placeholder="Filter by role and status"
                        onChange={(value) => {
                            if (value === "admin" || value === "customer") {
                                setFilterRole(value);
                                setIsActiveFilter("");
                            } else if (value === "active" || value === "not-active") {
                                setIsActiveFilter(value);
                                setFilterRole("");
                            } else {
                                setFilterRole("");
                                setIsActiveFilter("");
                            }
                        }}
                        style={{ width: 100, marginRight: 20 }}
                    >
                        <Select.Option value="">All</Select.Option>
                        <Select.Option value="admin">Admin</Select.Option>
                        <Select.Option value="customer">Customer</Select.Option>
                        <Select.Option value="active">Active</Select.Option>
                        <Select.Option value="not-active">Not Active</Select.Option>
                    </Select>
                    <Select
                        placeholder="Sort by"
                        onChange={setSortOrder}
                        style={{ width: 150, marginRight: 20 }}
                    >
                        <Select.Option value="">None</Select.Option>
                        <Select.Option value="abcAsc">Name A-Z</Select.Option>
                        <Select.Option value="abcDesc">Name Z-A</Select.Option>
                        <Select.Option value="createdAtAsc">Oldest Created</Select.Option>
                        <Select.Option value="createdAtDesc">Newest Created</Select.Option>
                    </Select>
                    <Button onClick={() => setVisibleCreateModal(true)}>Create User</Button>
                </div>
            </div>


            <div style={{ marginTop: 20 }}>
                <Title level={5}>Search Results:</Title>
                {filteredUsers.length > 0 ? (
                    <Table
                        bordered
                        dataSource={filteredUsers}
                        columns={columns}
                        rowKey="user_id"
                    />
                ) : (
                    <p>No results found.</p>
                )}
            </div>

            <Modal
                title="Create User"
                open={visibleCreateModal}
                onOk={handleOkCreate}
                onCancel={handleCancelCreate}
                okText="Create"
                cancelText="Cancel"
            >
                <Form layout="vertical">
                    <Form.Item label="Email" required>
                        <Input
                            value={createFormData.email}
                            onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                            placeholder="Enter email"
                        />
                    </Form.Item>
                    <Form.Item label="Password" required>
                        <Input.Password
                            value={createFormData.password}
                            onChange={(e) => setCreateFormData({ ...createFormData, password: e.target.value })}
                            placeholder="Enter password"
                        />
                    </Form.Item>
                    <Form.Item label="Role" required>
                        <Select
                            value={createFormData.role}
                            onChange={(value) => setCreateFormData({ ...createFormData, role: value })}
                        >
                            <Select.Option value="admin">Admin</Select.Option>
                            <Select.Option value="customer">Customer</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            <UpdateProfileModal
                visible={isUpdateModalOpen}
                onCancel={() => setIsUpdateModalOpen(false)}
                onUpdate={handleUpdate}
                profileData={currentUser}
            />
        </>
    );
};

export default UserTable;
