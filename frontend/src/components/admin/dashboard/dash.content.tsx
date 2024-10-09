'use client'
import { Breadcrumb, Layout, theme } from 'antd';  // theme để lấy useToken từ Ant Design
const { Content } = Layout;

const DashContent = () => {
    const { token } = theme.useToken();  // Dùng useToken từ Ant Design theme
    const { colorBgContainer, borderRadiusLG } = token;

    const breadcrumbItems = [
        { title: 'User', key: 'user' },
        { title: 'Bill', key: 'bill' },
    ];

    return (
        <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbItems} />
            <div
                style={{
                    padding: 24,
                    minHeight: 360,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                }}
            >
                Bill is a cat.
            </div>
        </Content>
    );
};

export default DashContent;
