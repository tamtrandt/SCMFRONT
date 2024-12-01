/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState } from "react";
import { Form, Input, Button, Row, Col, message, Modal, Divider } from "antd";
import { useRouter } from "next/navigation";
import { resendCode, verifyEmail } from "@/api/auth";
import Link from "next/link";

const Verify = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [emailForm] = Form.useForm();

    const onFinish = async (values: any) => {
        try {

            await verifyEmail(values.code);
            message.success("Email verified successfully!");
            router.push("/auth/login");
        } catch (error: any) {
            message.error(error.message || "Verification failed. Please try again.");
        }
    };

    const handleResendCode = async (email: any) => {
        try {
            setLoading(true);
            await resendCode(email);
            message.success("Verification code resent successfully!");
            setIsModalOpen(false);
        } catch (error: any) {
            message.error(error.message || "Failed to resend verification code.");
        } finally {
            setLoading(false);
        }
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const onEmailSubmit = async () => {
        try {
            const values = await emailForm.validateFields();
            handleResendCode(values.email);
        } catch (error) {
            message.error("Please enter a valid email.");
        }
    };

    return (
        <Row justify="center" style={{ marginTop: "50px" }}>
            <Col xs={24} md={16} lg={8}>
                <fieldset
                    style={{
                        padding: "30px",
                        margin: "10px",
                        border: "2px solid #ccc",
                        borderRadius: "10px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        backgroundColor: "#f9f9f9",
                    }}
                >
                    <legend
                        style={{
                            fontSize: "1.5em",
                            padding: "0 10px",
                            color: "#1890ff",
                            fontWeight: "bold",
                        }}
                    >
                        Verify Your Email
                    </legend>
                    <Form name="verify" onFinish={onFinish} layout="vertical">
                        <Form.Item
                            label="Verification Code"
                            name="code"
                            rules={[{ required: true, message: "Please enter your code!" }]}
                        >
                            <Input placeholder="Enter your verification code" />
                        </Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Verify
                        </Button>
                    </Form>
                    <Button
                        type="default"
                        onClick={openModal}
                        block
                        style={{ marginTop: 10 }}
                    >
                        Resend Code
                    </Button>
                    <Divider />

                    <div style={{ textAlign: "center" }}>
                        Ready to <Link href={"/auth/login"}>Login</Link>
                    </div>

                    {/* Modal để nhập email */}
                    <Modal
                        title="Resend Verification Code"
                        open={isModalOpen}
                        onCancel={closeModal}
                        footer={[
                            <Button key="cancel" onClick={closeModal}>
                                Cancel
                            </Button>,
                            <Button
                                key="submit"
                                type="primary"
                                loading={loading}
                                onClick={onEmailSubmit}
                            >
                                Resend
                            </Button>,
                        ]}
                    >
                        <Form form={emailForm} layout="vertical">
                            <Form.Item
                                label=""
                                name="email"
                                rules={[
                                    { required: true, message: "Please enter your email!" },
                                    { type: "email", message: "Please enter a valid email!" },
                                ]}
                            >
                                <Input placeholder="Enter your email" />
                            </Form.Item>
                        </Form>
                    </Modal>
                </fieldset>
            </Col>
        </Row>
    );
};

export default Verify;
