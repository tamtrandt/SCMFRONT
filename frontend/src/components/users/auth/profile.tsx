/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button, message } from "antd";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie'; // Đảm bảo đã import thư viện js-cookie

const Profile = () => {
    const router = useRouter();

    const onLogout = () => {
        // Xóa access token và thông tin người dùng khỏi cookies
        Cookies.remove("access_token");
        Cookies.remove("userInfo");
        router.push("/auth/login");
    };

    const onDeleteAccount = async () => {
        try {
            // Lấy access token từ cookies
            const accessToken = Cookies.get("access_token");

            const res = await fetch("http://localhost:5000/users/me", {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${accessToken}`, // Sử dụng access token từ cookies
                },
            });

            if (res.ok) {
                message.success("Account deleted successfully.");
                onLogout();
            } else {
                message.error("Failed to delete account.");
            }
        } catch (error) {
            message.error("An error occurred. Please try again.");
        }
    };

    return (
        <div>
            <Button type="primary" onClick={onLogout} block>
                Logout
            </Button>
            <Button
                type="primary"
                danger
                onClick={onDeleteAccount}
                block
                style={{ marginTop: 10 }}
            >
                Delete Account
            </Button>
        </div>
    );
};

export default Profile;
