"use client";

import { MenuFoldOutlined, MenuUnfoldOutlined, PoweroffOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Layout, message } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
import { AdminContext } from './animation';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const AdminHeader = () => {
    const { Header } = Layout;
    const { collapseMenu, setCollapseMenu } = useContext(AdminContext)!;
    const router = useRouter(); // Hook để điều hướng trang

    const [username, setUsername] = useState(); // Khởi tạo với giá trị mặc định

    useEffect(() => {
        const userInfo = localStorage.getItem('user_data'); // Lấy thông tin người dùng từ localStorage
        if (userInfo) {
            const parsedUserInfo = JSON.parse(userInfo); // Parse chuỗi JSON thành object
            if (parsedUserInfo.email) {
                // Tách tên người dùng từ email
                const emailParts = parsedUserInfo.email.split('@');
                if (emailParts.length > 0) {
                    setUsername(emailParts[0]); // Cập nhật tên người dùng (phần trước @)
                }
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user_data');// Xóa thông tin người dùng khỏi cookies
        Cookies.remove('access_token'); // Xóa access token khỏi cookies (nếu bạn lưu ở đây)

        router.push('/auth/login'); // Chuyển hướng đến trang đăng nhập
        message.success("Logout successful!"); // Hiển thị thông báo
    };

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <span>
                    <UserOutlined style={{ marginRight: 8 }} /> {/* Icon cho Profile */}
                    Profile
                </span>
            ),
        },
        {
            key: '0',
            danger: true,
            label: (
                <span>
                    <PoweroffOutlined style={{ marginRight: 8 }} /> {/* Icon cho Logout */}
                    Logout
                </span>
            ),
            onClick: handleLogout, // Thêm hàm gọi khi nhấn
        },
    ];

    return (
        <>
            <Header
                style={{
                    padding: 0,
                    display: "flex",
                    background: "#f5f5f5",
                    justifyContent: "space-between",
                    alignItems: "center"
                }} >

                <Button
                    type="text"
                    icon={collapseMenu ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => setCollapseMenu(!collapseMenu)}
                    style={{
                        fontSize: '16px',
                        width: 64,
                        height: 64,
                    }}
                />
                <Dropdown menu={{ items }} >
                    <a onClick={(e) => e.preventDefault()}
                        style={{ color: "unset", lineHeight: "0 !important", marginRight: 20 }}
                    >
                        <Space>
                            Welcome {username} {/* Hiển thị tên người dùng */}
                            <DownOutlined />
                        </Space>
                    </a>
                </Dropdown>
            </Header>
        </>
    );
}

export default AdminHeader;
