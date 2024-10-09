'use client'

import { Layout } from "antd";

export default function DashFooter() {

    const { Footer } = Layout;

    return (
        <Footer style={{ textAlign: 'center' }}>
            Supply Chain Management ©{new Date().getFullYear()} Created by TAM TRAN
        </Footer>
    );
}
