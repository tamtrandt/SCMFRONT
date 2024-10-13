/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Form, Input, Button, Row, Col, message } from "antd";
import { useRouter } from "next/navigation";

const Verify = () => {
    const router = useRouter();

    const onFinish = async (values: any) => {
        try {
            const res = await fetch("http://localhost:5000/auth/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: values.code }),
            });

            const data = await res.json();

            if (res.ok) {
                message.success(data.message);
                router.push("/auth/login"); // Điều hướng đến trang đăng nhập
            } else {
                message.error(data.message);
            }
        } catch (error) {
            message.error("Verification failed. Please try again.");
        }
    };

    return (
        <Row justify="center" style={{ marginTop: "50px" }}>
            <Col xs={24} md={16} lg={8}>
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
            </Col>
        </Row>
    );
};

export default Verify;
