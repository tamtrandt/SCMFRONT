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
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Lưu access token vào cookies
            Cookies.set('access_token', data.access_token);

            // Điều hướng dựa vào quyền truy cập
            if (data.role === 'admin') {
                router.push('/dashboard');
            } else {
                router.push('/home');
            }
        } catch (error: any) {
            message.error(error.message);
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
                                { type: 'email', message: '' },
                                {
                                    validator: (_, value) => {
                                        if (value && !value.endsWith('@gmail.com')) {
                                            return Promise.reject(new Error('Email must be a @gmail.com'));
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                        >
                            <Input placeholder="Enter your email" />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                { required: true, message: 'Please input your password!' },
                                {
                                    min: 6,
                                },
                                {
                                    validator: (_, value) => {
                                        if (value && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(value)) {
                                            return Promise.reject(new Error('Password must include at least uppercase letter, lowercase letter, number, and special character!'));
                                        }
                                        return Promise.resolve();
                                    },
                                },
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

