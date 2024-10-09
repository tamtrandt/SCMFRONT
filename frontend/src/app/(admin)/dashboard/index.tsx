'use client'

import { Layout } from 'antd';
import DashFooter from '@/components/admin/dashboard/dash.footer';
import DashHeader from '@/components/admin/dashboard/dash.header';
import DashSidebar from '@/components/admin/dashboard/dash.sidebar';
import DashContent from '@/components/admin/dashboard/dash.content';


const App: React.FC = () => {



    return (
        <Layout style={{ minHeight: '100vh' }}>
            <DashSidebar />
            <Layout>
                <DashHeader />
                <DashContent />
                <DashFooter />
            </Layout>
        </Layout>
    );
};

export default App;