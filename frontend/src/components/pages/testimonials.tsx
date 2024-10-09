/* eslint-disable react/no-unescaped-entities */
'use client';
import { Carousel, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const testimonials = [
    { id: 1, user: 'John Doe', comment: 'Amazing service and easy to use!' },
    { id: 2, user: 'Jane Smith', comment: 'A seamless experience from start to finish.' },
    { id: 3, user: 'Emily Johnson', comment: 'The best supply chain management system!' },
];

export default function Testimonials() {
    return (
        <div style={{ padding: '50px 0', backgroundColor: '#fafafa' }}>
            <Title level={2} style={{ textAlign: 'center' }}>What Our Users Say</Title>
            <Carousel autoplay>
                {testimonials.map(t => (
                    <div key={t.id}>
                        <Paragraph>"{t.comment}"</Paragraph>
                        <Paragraph>- {t.user}</Paragraph>
                    </div>

                ))}
            </Carousel>
        </div>
    );
}
