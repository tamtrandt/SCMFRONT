'use client'

import React, { useEffect, useState } from "react";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { Modal } from "antd";
import Cookies from "js-cookie";
import { ProfileData } from "@/components/utils/interfaces";
import { getProfile, updateUser, deleteUser } from "@/api/users";
import UpdateProfileModal from "./updateuser";


export const Profile = () => {
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);


    useEffect(() => {
        async function fetchProfile() {
            try {
                const data = await getProfile();
                setProfileData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unable to load user information");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, []);

    const handleUpdate = async (updateUserDto: Partial<ProfileData>) => {
        if (!profileData) return;

        if (!updateUserDto.phone || !/^\+?[1-9]\d{1,14}$/.test(updateUserDto.phone)) {
            message.error("Invalid phone number!");
            return;
        }

        try {
            const response = await updateUser(profileData.user_id, updateUserDto);
            message.success(response.message);
            setProfileData(response.updatedUser);
            setIsModalOpen(false);
        } catch (err) {
            message.error(err instanceof Error ? err.message : "Update failed");
        }
    };

    const handleDelete = async () => {
        if (!profileData) return;

        Modal.confirm({
            title: 'Confirm Account Deletion',
            content: 'Are you sure you want to delete this account? This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await deleteUser(profileData.user_id);
                    Cookies.remove("access_token");
                    localStorage.removeItem("user_data");
                    message.success("Account deleted successfully");
                    router.push("/auth/login");
                } catch (err) {
                    message.error(err instanceof Error ? err.message : "Account deletion failed");
                }
            },
        });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!profileData) {
        return <div>No user data available.</div>;
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem", backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
            <div style={{ backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", padding: "2rem", width: "100%", maxWidth: "600px" }}>
                <h2 style={{ marginBottom: "1rem", fontSize: "1.5rem", fontWeight: "bold", color: "#333" }}>User Profile</h2>
                <div style={{ marginBottom: "1rem", color: "#555" }}>
                    <div style={{ marginBottom: "0.5rem" }}>
                        <strong>User ID:</strong> {profileData.user_id}
                    </div>
                    <div style={{ marginBottom: "0.5rem" }}>
                        <strong>Username:</strong> {profileData.username}
                    </div>
                    <div style={{ marginBottom: "0.5rem" }}>
                        <strong>Email:</strong> {profileData.email}
                    </div>
                    <div style={{ marginBottom: "0.5rem" }}>
                        <strong>Phone Number:</strong> {profileData.phone}
                    </div>
                    <div style={{ marginBottom: "0.5rem" }}>
                        <strong>Address:</strong> {profileData.address}
                    </div>
                    <div style={{ marginBottom: "0.5rem" }}>
                        <strong>Role:</strong> {profileData.role}
                    </div>
                    <div style={{ marginBottom: "0.5rem" }}>
                        <strong>Status:</strong> {profileData.isactive ? "Active" : "Inactive"}
                    </div>
                    <div style={{ marginBottom: "0.5rem" }}>
                        <strong>Created At:</strong> {new Date(profileData.create_at).toLocaleString("en-US")}
                    </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", maxWidth: "600px", marginTop: "1rem" }}>
                    <button
                        style={{ backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", padding: "0.5rem 1rem", cursor: "pointer", transition: "background-color 0.3s", boxShadow: "0 2px 4px rgba(0, 123, 255, 0.3)" }}
                        onClick={() => setIsModalOpen(true)}
                    >
                        Update Account
                    </button>
                    <UpdateProfileModal
                        visible={isModalOpen}
                        onCancel={() => setIsModalOpen(false)}
                        onUpdate={handleUpdate}
                        profileData={profileData}
                    />
                    <button
                        style={{ backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", padding: "0.5rem 1rem", cursor: "pointer", transition: "background-color 0.3s", boxShadow: "0 2px 4px rgba(220, 53, 69, 0.3)" }}
                        onClick={handleDelete}
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

