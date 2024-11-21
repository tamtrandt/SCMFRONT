/* eslint-disable @typescript-eslint/no-unused-vars */
// 'use client'
// import Layout from "antd/es/layout";
// import Menu from "antd/es/menu";
// import {
//     DashboardOutlined,
//     FolderOpenOutlined,
//     ProductOutlined,
//     RocketOutlined,
//     TeamOutlined,
// } from '@ant-design/icons';
// import React, { useContext } from 'react';
// import type { MenuProps } from 'antd';
// import Link from 'next/link'
// import { AdminContext } from "./animation";


// type MenuItem = Required<MenuProps>['items'][number];
// const AdminSideBar = () => {
//     const { Sider } = Layout;
//     const { collapseMenu } = useContext(AdminContext)!;

//     const items: MenuItem[] = [
//         {
//             key: 'grp',
//             label: 'SCM',
//             type: 'group',
//             children: [
//                 {
//                     key: "dashboard",
//                     label: <Link href={"/dashboard"}>Dashboard</Link>,
//                     icon: <DashboardOutlined />,
//                 },
//                 {
//                     key: "users",
//                     label: <Link href={"/dashboard/users"}>Manage Users</Link>,
//                     icon: <TeamOutlined />,
//                 },
//                 {
//                     key: "products",
//                     label: 'Manage Products',
//                     icon: <ProductOutlined />,
//                     children: [ // Thêm children cho nhóm products
//                         {
//                             key: "storage",
//                             label: <Link href={"/dashboard/products"}>Storage</Link>,
//                             icon: <FolderOpenOutlined />, // Bạn có thể thay đổi icon tùy theo ý muốn
//                         },
//                         {
//                             key: "releasing",
//                             label: <Link href={""}>Releasing</Link>,
//                             icon: <RocketOutlined />, // Bạn có thể thay đổi icon tùy theo ý muốn
//                         },
//                     ],
//                 },
//             ],
//         },
//     ];
//     return (
//         <Sider
//             collapsed={collapseMenu}
//         >

//             <Menu
//                 mode="inline"
//                 defaultSelectedKeys={['dashboard']}
//                 items={items}
//                 style={{ height: '100vh' }}
//             />
//         </Sider>
//     )
// }

// export default AdminSideBar;


'use client'

import React, { useContext, useState } from 'react';
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import {
    DashboardOutlined,
    FolderOpenOutlined,
    ProductOutlined,
    RocketOutlined,
    TeamOutlined,
    WalletOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import Link from 'next/link';
import { AdminContext } from "./animation"; // Your AdminContext file
import WalletModal from '@/components/componentspage/walletmodal';


type MenuItem = Required<MenuProps>['items'][number];

const AdminSideBar: React.FC = () => {
    const { Sider } = Layout;
    const { collapseMenu } = useContext(AdminContext)!;
    const [walletModalVisible, setWalletModalVisible] = useState(false);

    // Handlers for wallet modal
    const openWalletModal = () => setWalletModalVisible(true);
    const closeWalletModal = () => setWalletModalVisible(false);

    // Sidebar menu items
    const items: MenuItem[] = [
        {
            key: 'grp',
            label: 'SCM',
            type: 'group',
            children: [
                {
                    key: "dashboard",
                    label: <Link href={"/dashboard"}>Dashboard</Link>,
                    icon: <DashboardOutlined />,
                },
                {
                    key: "users",
                    label: <Link href={"/dashboard/users"}>Manage Users</Link>,
                    icon: <TeamOutlined />,
                },
                {
                    key: "products",
                    label: 'Manage Products',
                    icon: <ProductOutlined />,
                    children: [
                        {
                            key: "storage",
                            label: <Link href={"/dashboard/products"}>Storage</Link>,
                            icon: <FolderOpenOutlined />,
                        },
                        {
                            key: "releasing",
                            label: <Link href={""}>Releasing</Link>,
                            icon: <RocketOutlined />,
                        },
                    ],
                },
                {
                    key: "wallet",
                    label: "Connect Wallet",
                    icon: <WalletOutlined />,
                    onClick: openWalletModal, // Open modal on click
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
        </>
    );
};

export default AdminSideBar;
