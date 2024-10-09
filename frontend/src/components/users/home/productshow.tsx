/* eslint-disable @next/next/no-img-element */
'use client';
import { Row, Col, Card } from 'antd';

const { Meta } = Card;

const products = [
    { id: 1, name: 'Product 1', description: 'This is product 1', image: 'image1.jpg' },
    { id: 2, name: 'Product 2', description: 'This is product 2', image: 'image2.jpg' },
    { id: 3, name: 'Product 3', description: 'This is product 3', image: 'image3.jpg' },
];

export default function ProductShowcase() {
    return (
        <div style={{ padding: '30px' }}>
            <Row gutter={16}>
                {products.map(product => (
                    <Col key={product.id} span={8}>
                        <Card
                            hoverable
                            cover={<img alt={product.name} src={product.image} />}
                        >
                            <Meta title={product.name} description={product.description} />
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}
