/* eslint-disable @typescript-eslint/no-unused-vars */

import { AdminContextProvider } from "@/components/admin/dashboard/animation";
import AdminContent from "@/components/admin/content";
import AdminFooter from "@/components/admin/dashboard/footer";
import AdminSideBar from "@/components/admin/dashboard/sidebar";
import AdminHeader from "@/components/admin/dashboard/header";
import Header from "@/components/users/home/header";
import AppFooter from "@/components/users/home/footer";
import AppSideBar from "@/components/users/home/sidebar";



const AdminLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {

    return (
        <AdminContextProvider>
            <div style={{ display: "flex" }}>
                <div className='left-side' style={{ minWidth: 80 }}>
                    <AppSideBar />
                </div>
                <div className='right-side' style={{ flex: 1 }}>
                    <Header />
                    <AdminContent>
                        {children}
                    </AdminContent>
                    <AppFooter />
                </div>
            </div>
        </AdminContextProvider>
    )
}

export default AdminLayout