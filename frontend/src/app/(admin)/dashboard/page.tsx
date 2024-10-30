/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import AdminCard from "@/components/admin/dashboard/card";
import { AntdRegistry } from "@ant-design/nextjs-registry";




const DashboardPage = () => {



    return (
        <div>
            <AntdRegistry> <AdminCard /></AntdRegistry>

        </div>
    );
};

export default DashboardPage;
