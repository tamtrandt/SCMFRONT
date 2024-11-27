/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useContext, useState } from 'react';
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import {
    DashboardOutlined,
    DropboxOutlined,
    FolderOpenOutlined,
    LinkOutlined,
    ProductOutlined,
    RocketOutlined,
    ShoppingCartOutlined,
    ShoppingOutlined,
    TeamOutlined,
    WalletOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import Link from 'next/link';

import WalletModal from '@/components/componentspage/walletmodal';
import { AdminContext } from '@/components/admin/dashboard/animation';
import CartModal from '../products/cartmodal';


type MenuItem = Required<MenuProps>['items'][number];

const AppSideBar: React.FC = () => {
    const { Sider } = Layout;
    const { collapseMenu } = useContext(AdminContext)!;
    const [walletModalVisible, setWalletModalVisible] = useState(false);
    const [cartModalVisible, setCartModalVisible] = useState(false);

    // Handlers for wallet modal
    const openWalletModal = () => setWalletModalVisible(true);
    const closeWalletModal = () => setWalletModalVisible(false);
    // Open/Close Cart Modal
    const openCartModal = () => setCartModalVisible(true);
    const closeCartModal = () => setCartModalVisible(false);

    // Sidebar menu items
    const items: MenuItem[] = [
        {
            key: 'grp',
            label: 'SCM',
            type: 'group',
            children: [
                {
                    key: "home",
                    label: <Link href={"/home"}>Home</Link>,
                    icon: <DashboardOutlined />,
                },
                {
                    key: "products",
                    label: <Link href={"/home/products"}>Marketplace</Link>,
                    icon: <ProductOutlined />,
                },
                {
                    key: "cart",
                    label: "Cart",
                    icon: <ShoppingOutlined />,
                    onClick: openCartModal, // Open Cart Modal on click
                },
                {
                    key: "wallet",
                    label: 'Wallet',
                    icon: <WalletOutlined />,
                    children: [
                        {
                            key: "wallet",
                            label: "Connect Wallet",
                            icon: <LinkOutlined />,
                            onClick: openWalletModal, // Open modal on click
                        },
                        {
                            key: "store",
                            label: <Link href={""}>Storage</Link>,
                            icon: <DropboxOutlined />,
                        },
                    ],
                },

            ],
        },
    ];

    return (
        <>
            <Sider collapsed={collapseMenu}>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['dashboard']}
                    items={items}
                    style={{ height: '100vh' }}
                />
            </Sider>

            {/* Wallet Modal */}
            <WalletModal
                visible={walletModalVisible}
                onClose={closeWalletModal}
            />


            {/* Cart Modal */}
            <CartModal
                visible={cartModalVisible}
                onClose={closeCartModal}
            />
        </>
    );
};

export default AppSideBar;
