/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'
import { Button, Col, Divider, Form, Input, message, Row } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isValidPhoneNumber } from 'libphonenumber-js';



const Register = () => {
    const router = useRouter();

    const onFinish = async (values: any) => {
        try {
            const res = await fetch("http://localhost:5000/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            const data = await res.json();

            if (res.ok) {
                message.success("Registration successful! Check your email for verification.");
                router.push("/auth/verify");
            } else {
                message.error(data.message);
            }
        } catch (error) {
            message.error("Registration failed. Please try again.");
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
                                {
                                    validator: (_, value) =>
                                        value && isValidPhoneNumber(value, 'VN')
                                            ? Promise.resolve()
                                            : Promise.reject(new Error('Enter a valid phone number!')),
                                },
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

