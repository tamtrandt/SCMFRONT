'use client'
import { Layout } from 'antd';

const AppFooter = () => {
    const { Footer } = Layout;

    return (
        <>
            <Footer style={{ textAlign: 'center' }}>
                SCM ©{new Date().getFullYear()} Created by @SCM
            </Footer>
        </>
    )
}

export default AppFooter;