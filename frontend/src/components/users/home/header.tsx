/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { MenuFoldOutlined, MenuUnfoldOutlined, PoweroffOutlined, UserOutlined, WalletOutlined } from '@ant-design/icons';
import { Button, Layout, message } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

import Link from 'next/link';
import { AdminContext } from '@/components/admin/dashboard/animation';

const AppHeader = () => {
    const { Header } = Layout;
    const { collapseMenu, setCollapseMenu } = useContext(AdminContext)!;
    const router = useRouter();

    const [username, setUsername] = useState();

    useEffect(() => {
        const userInfo = localStorage.getItem('user_data');
        if (userInfo) {
            const parsedUserInfo = JSON.parse(userInfo);
            if (parsedUserInfo.email) {

                const emailParts = parsedUserInfo.email.split('@');
                if (emailParts.length > 0) {
                    setUsername(emailParts[0]);
                }
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user_data');
        Cookies.remove('access_token');

        router.push('/auth/login');
        message.success("Logout successful!");
    };

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <Link href="/home/profile">
                    <span>
                        <UserOutlined style={{ marginRight: 8 }} />
                        Profile
                    </span>
                </Link>
            ),
        },
        {
            key: '0',
            danger: true,
            label: (
                <span>
                    <PoweroffOutlined style={{ marginRight: 8 }} />
                    Logout
                </span>
            ),
            onClick: handleLogout,
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
                            Welcome {username}
                            <DownOutlined />
                        </Space>
                    </a>
                </Dropdown>
            </Header>
        </>
    );
}

export default AppHeader;
