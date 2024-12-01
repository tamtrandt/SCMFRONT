"use client";

import { MenuFoldOutlined, MenuUnfoldOutlined, PoweroffOutlined, UserOutlined, WalletOutlined, DownOutlined } from '@ant-design/icons';
import { Button, Layout, message, Dropdown, Space } from 'antd';
import { useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { AdminContext } from './animation';
import Link from 'next/link';

const AdminHeader = () => {
    const { Header } = Layout;
    const { collapseMenu, setCollapseMenu } = useContext(AdminContext)!;
    const router = useRouter();

    const [username, setUsername] = useState<string | undefined>();

    useEffect(() => {
        const userInfo = localStorage.getItem('user_data');
        if (userInfo) {
            const parsedUserInfo = JSON.parse(userInfo);
            const emailParts = parsedUserInfo.email.split('@');
            if (emailParts.length > 0) {
                setUsername(emailParts[0]);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user_data');
        Cookies.remove('access_token');
        router.push('/auth/login');
        message.success("Logout successful!");
    };

    const menuItems = [
        {
            key: '1',
            label: (
                <Link href="/dashboard/profile">
                    <span><UserOutlined style={{ marginRight: 8 }} /> Profile</span>
                </Link>
            ),
        },
        {
            key: '2',
            label: (
                <span><WalletOutlined style={{ marginRight: 8 }} /> Connect Wallet</span>
            ),
        },
        {
            key: '0',
            danger: true,
            label: (
                <span><PoweroffOutlined style={{ marginRight: 8 }} /> Logout</span>
            ),
            onClick: handleLogout,
        },
    ];

    return (
        <Header
            style={{
                padding: 0,
                display: "flex",
                background: "#f5f5f5",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <Button
                type="text"
                icon={collapseMenu ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapseMenu(!collapseMenu)}
                style={{ fontSize: '16px', width: 64, height: 64 }}
            />
            <Dropdown menu={{ items: menuItems }}>
                <a onClick={(e) => e.preventDefault()} style={{ color: "unset", marginRight: 20 }}>
                    <Space>
                        Welcome {username}
                        <DownOutlined />
                    </Space>
                </a>
            </Dropdown>
        </Header>
    );
};

export default AdminHeader;
