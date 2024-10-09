'use client';
import { Button, Typography } from 'antd';

const { Title, Paragraph } = Typography;

export default function HeroSection() {
    return (
        <div style={{ backgroundColor: '#f0f2f5', padding: '50px 0', textAlign: 'center' }}>
            <Title>Welcome to Supply Chain Management</Title>
            <Paragraph>Manage your orders and products easily and efficiently.</Paragraph>
            <Button type="primary" size="large">Get Started</Button>
        </div>
    );
}