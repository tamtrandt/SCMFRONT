/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { Button, Col, Divider, Form, Input, message, Row } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Cookies from 'js-cookie';
const Login = () => {

    const router = useRouter();

    const onFinish = async (values: any) => {
        try {
            const res = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            const data = await res.json();

            if (res.ok) {
                message.success("Login successful!");

                // Lưu access token và thông tin người dùng vào cookies
                Cookies.set('access_token', data.access_token, { expires: 1 }); // Cookie hết hạn sau 1 ngày
                Cookies.set('userInfo', JSON.stringify(data.user), { expires: 1 }); // Cookie hết hạn sau 1 ngày

                // Lấy user info từ cookies
                const userInfo = JSON.parse(Cookies.get('userInfo') ?? '{}'); // Giá trị mặc định là một chuỗi rỗng

                // Chuyển hướng dựa trên vai trò người dùng
                const role = userInfo.role; // Lấy vai trò từ thông tin người dùng
                router.push(role === "admin" ? "/dashboard" : "/home");
            } else {
                message.error(data.message);
                if (data.message.includes("Account not verified")) {
                    router.push("/auth/verify");
                }
            }
        } catch (error) {
            message.error("Login failed. Please try again.");
        }
    };

    return (
        <Row justify={"center"} style={{ marginTop: "50px" }}>
            <Col xs={24} md={16} lg={8}>
                <fieldset style={{
                    padding: "30px",
                    margin: "10px",
                    border: "2px solid #ccc",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#f9f9f9"
                }}>
                    <legend style={{
                        fontSize: "1.5em",
                        padding: "0 10px",
                        color: "#1890ff",
                        fontWeight: "bold"
                    }}>Login to Your Account</legend>

                    <Form
                        name="login"
                        onFinish={onFinish}
                        autoComplete="off"
                        layout='vertical'
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Please input your email!' },
                                { type: 'email', message: 'The input is not valid email!' }
                            ]}
                        >
                            <Input placeholder="Enter your email" />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                { required: true, message: 'Please input your password!' },
                                { min: 6, message: 'Password must be at least 6 characters!' }
                            ]}
                        >
                            <Input.Password placeholder="Enter your password" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{
                                width: "100%",
                                backgroundColor: "#1890ff",
                                borderColor: "#1890ff",
                                borderRadius: "5px"
                            }}>
                                Login
                            </Button>
                        </Form.Item>
                    </Form>

                    <Link href={"/"}>
                        <Button type="link" icon={<ArrowLeftOutlined />} style={{ paddingLeft: "0" }}>
                            Back to Homepage
                        </Button>
                    </Link>

                    <Divider />

                    <div style={{ textAlign: "center" }}>
                        Don't have an account? <Link href={"/auth/register"}>Register</Link>
                    </div>

                </fieldset>
            </Col>
        </Row>
    )
}

export default Login;

