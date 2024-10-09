/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React from 'react';
import { Button, Col, Divider, Form, Input, notification, Row } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import bcrypt from 'bcrypt';

const Register = () => {

    const onFinish = async (values: any) => {
        // Thực hiện lưu thông tin user vào database (ví dụ qua API)
        const hashedPassword = await bcrypt.hash(values.password, 10);
        const response = await fetch('/api/register', {
            method: 'POST',
            body: JSON.stringify({
                email: values.email,
                password: hashedPassword,
                name: values.name,
                phone: values.phone,
                address: values.address
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            notification.success({ message: 'Registration successful' });
            window.location.href = '/auth/login';
        } else {
            notification.error({ message: 'Registration failed' });
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
                    }}>Register an Account</legend>

                    <Form
                        name="register"
                        onFinish={onFinish}
                        autoComplete="off"
                        layout='vertical'
                    >
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[
                                { required: true, message: 'Please input your username!' },
                            ]}
                        >
                            <Input placeholder="Enter your username" />
                        </Form.Item>

                        <Form.Item
                            label="Phone"
                            name="phone"
                            rules={[
                                { required: true, message: 'Please input your phone number!' },
                                { pattern: /^\d{10,11}$/, message: 'Enter a valid phone number!' },
                            ]}
                        >
                            <Input placeholder="Enter your phone number" />
                        </Form.Item>

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

                        <Form.Item
                            label="Address"
                            name="address"
                            rules={[
                                { required: true, message: 'Please input your address!' }
                            ]}
                        >
                            <Input placeholder="Enter your address" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{
                                width: "100%",
                                backgroundColor: "#1890ff",
                                borderColor: "#1890ff",
                                borderRadius: "5px"
                            }}>
                                Register
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
                        Already have an account? <Link href={"/auth/login"}>Login</Link>
                    </div>

                </fieldset>
            </Col>
        </Row>
    )
}

export default Register;
