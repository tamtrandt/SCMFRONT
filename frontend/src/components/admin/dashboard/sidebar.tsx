/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import {
    DashboardOutlined,
    ProductOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import React, { useContext } from 'react';
import type { MenuProps } from 'antd';
import Link from 'next/link'
import { AdminContext } from "./animation";


type MenuItem = Required<MenuProps>['items'][number];
const AdminSideBar = () => {
    const { Sider } = Layout;
    const { collapseMenu } = useContext(AdminContext)!;

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
                    label: <Link href={"/dashboard/products"}>Manage Products</Link>,
                    icon: <ProductOutlined />,
                },

            ],
        },
    ];

    return (
        <Sider
            collapsed={collapseMenu}
        >

            <Menu
                mode="inline"
                defaultSelectedKeys={['dashboard']}
                items={items}
                style={{ height: '100vh' }}
            />
        </Sider>
    )
}

export default AdminSideBar;