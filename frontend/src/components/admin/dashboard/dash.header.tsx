/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { Layout, theme } from "antd";


export default function DashHeader() {

    const { Header } = Layout;
    const {
        token: { colorBgContainer },
    } = theme.useToken();



    return (
        <Header style={{ padding: 0, background: colorBgContainer }} />
    );
}
