/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client'
// import React, { useState } from 'react';
// import { Button, Col, Divider, Form, Input, notification, Row } from 'antd';
// import { ArrowLeftOutlined } from '@ant-design/icons';
// import Link from 'next/link';
// import { signIn } from '@/auth';
// import { useRouter } from 'next/navigation';
// import { loginUser } from '@/api/api';
// const Login = () => {
//     const [error, setError] = useState("");
//     const router = useRouter();

//     const onFinish = async (values: any) => {
//         const result = await signIn("credentials", {
//             redirect: false,
//             email: values.email,
//             password: values.password,
//         });

//         if (result.error) {
//             setError(result.error);
//         } else {
//             // Nếu đăng nhập thành công, chuyển hướng đến trang chính
//             router.push("/");
//         }
//     };


//     return (
//         <Row justify={"center"} style={{ marginTop: "50px" }}>
//             <Col xs={24} md={16} lg={8}>
//                 <fieldset style={{
//                     padding: "30px",
//                     margin: "10px",
//                     border: "2px solid #ccc",
//                     borderRadius: "10px",
//                     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//                     backgroundColor: "#f9f9f9"
//                 }}>
//                     <legend style={{
//                         fontSize: "1.5em",
//                         padding: "0 10px",
//                         color: "#1890ff",
//                         fontWeight: "bold"
//                     }}>Login to Your Account</legend>

//                     <Form
//                         name="login"
//                         onFinish={onFinish}
//                         autoComplete="off"
//                         layout='vertical'
//                     >
//                         <Form.Item
//                             label="Email"
//                             name="email"
//                             rules={[
//                                 { required: true, message: 'Please input your email!' },
//                                 { type: 'email', message: 'The input is not valid email!' }
//                             ]}
//                         >
//                             <Input placeholder="Enter your email" />
//                         </Form.Item>

//                         <Form.Item
//                             label="Password"
//                             name="password"
//                             rules={[
//                                 { required: true, message: 'Please input your password!' },
//                                 { min: 6, message: 'Password must be at least 6 characters!' }
//                             ]}
//                         >
//                             <Input.Password placeholder="Enter your password" />
//                         </Form.Item>

//                         <Form.Item>
//                             <Button type="primary" htmlType="submit" style={{
//                                 width: "100%",
//                                 backgroundColor: "#1890ff",
//                                 borderColor: "#1890ff",
//                                 borderRadius: "5px"
//                             }}>
//                                 Login
//                             </Button>
//                         </Form.Item>
//                     </Form>

//                     <Link href={"/"}>
//                         <Button type="link" icon={<ArrowLeftOutlined />} style={{ paddingLeft: "0" }}>
//                             Back to Homepage
//                         </Button>
//                     </Link>

//                     <Divider />

//                     <div style={{ textAlign: "center" }}>
//                         Don't have an account? <Link href={"/auth/register"}>Register</Link>
//                     </div>

//                 </fieldset>
//             </Col>
//         </Row>
//     )
// }

// export default Login;


"use client";

import { Form, Input, Button, Row, Col, Divider, message } from "antd";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const Login = () => {
    const router = useRouter();

    const onFinish = async (values: any) => {
        const res = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
        });

        if (res?.ok) {
            message.success("Login successful!");
            router.push("/dashboard"); // Điều hướng sau khi đăng nhập thành công
        } else {
            message.error("Invalid credentials. Please try again.");
        }
    };

    return (
        <Row justify="center" style={{ marginTop: "50px" }}>
            <Col xs={24} md={16} lg={8}>
                <Form name="login" onFinish={onFinish} layout="vertical">
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: "Please input your email!" }]}
                    >
                        <Input placeholder="Enter your email" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: "Please input your password!" }]}
                    >
                        <Input.Password placeholder="Enter your password" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Login
                        </Button>
                    </Form.Item>
                </Form>
                <Divider />
            </Col>
        </Row>
    );
};

