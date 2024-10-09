'use client';
import { Layout, Menu, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Logo from '@/public/images/logo.jpg';
import Link from 'next/link';

const { Header } = Layout;

export default function AppHeader() {
    const menuItems = [
        { label: 'Home', key: '1' },
        { label: 'Products', key: '2' },
        { label: 'Orders', key: '3' },
        { label: 'Profile', key: '4' },
    ];

    return (
        <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Logo bo tròn */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Image
                    src={Logo}
                    alt="Logo"
                    width={50}
                    height={50}
                    style={{ borderRadius: '50%' }} // Bo tròn logo
                />
            </div>

            {/* Menu items trải đều */}
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} items={menuItems} style={{ flex: 1 }} />

            {/* Avatar user link đến trang login */}
            <Link href="/auth/login"> {/* Liên kết tới trang login */}
                <Avatar size="large" icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
            </Link>
        </Header>
    );
}
