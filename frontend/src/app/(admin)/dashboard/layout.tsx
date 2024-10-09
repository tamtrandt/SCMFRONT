import { AdminContextProvider } from "@/components/admin/animation";
import AdminContent from "@/components/admin/content";
import AdminFooter from "@/components/admin/footer";
import AdminHeader from "@/components/admin/header";
import AdminSideBar from "@/components/admin/sidebar";


const AdminLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {

    return (
        <AdminContextProvider>
            <div style={{ display: "flex" }}>
                <div className='left-side' style={{ minWidth: 80 }}>
                    <AdminSideBar />
                </div>
                <div className='right-side' style={{ flex: 1 }}>
                    <AdminHeader />
                    <AdminContent>
                        {children}
                    </AdminContent>
                    <AdminFooter />
                </div>
            </div>
        </AdminContextProvider>
    )
}

export default AdminLayout