'use client';
import { Layout, Button, Row, Col, Typography, Card } from 'antd';
import Image from 'next/image';
import styles from './Home.module.css';
import Logo from '@/public/images/logo.jpg'
import Back1 from '@/public/images/back1.png'
import { Footer } from 'antd/es/layout/layout';
import { FacebookOutlined, GithubOutlined, LinkedinOutlined, TwitterOutlined } from '@ant-design/icons';
import Link from 'next/link';



const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

export default function HomePage() {
  return (

    <Layout>
      {/* Header */}
      <Header className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src={Logo}
            alt="Logo"
            width={50}
            height={50}
            style={{ borderRadius: '50%' }} // Bo tròn logo
          />
        </div>
        <Button type="primary" href="/login">Get Started</Button>
      </Header>

      {/* Hero Section */}
      <Content className={styles.heroSection}>
        <div className={styles.heroContent}>
          <Title level={1}>Welcome to Your Product</Title>
          <Paragraph>
            Build, deploy, and scale applications effortlessly using our platform.
          </Paragraph>
          <Button type="primary" size="large" href="/learn-more">
            Learn More
          </Button>
        </div>
        <Image src={Back1} alt="Hero" width={600} height={400} />
      </Content>

      {/* Features Section */}
      <Content className={styles.featuresSection}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Card title="Feature 1" bordered={false}>
              <p>Fast and Secure</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card title="Feature 2" bordered={false}>
              <p>Easy Integration</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card title="Feature 3" bordered={false}>
              <p>24/7 Support</p>
            </Card>
          </Col>
        </Row>
      </Content>



      {/* Footer */}
      <Footer style={{
        backgroundColor: '#001529',
        color: 'white',
        padding: '40px 20px',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          {/* Các cột chứa link */}
          <Row gutter={[32, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Title level={5} style={{ color: 'white' }}>Product</Title>
              <ul style={{
                listStyle: 'none',
                padding: 0,
              }}>
                <li style={{ marginBottom: '10px' }}>
                  <Link href="/features" style={{ color: '#ffffff', textDecoration: 'none', transition: 'color 0.3s' }}>Features</Link>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <Link href="/pricing" style={{ color: '#ffffff', textDecoration: 'none', transition: 'color 0.3s' }}>Pricing</Link>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <Link href="/docs" style={{ color: '#ffffff', textDecoration: 'none', transition: 'color 0.3s' }}>Documentation</Link>
                </li>
              </ul>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Title level={5} style={{ color: 'white' }}>Company</Title>
              <ul style={{
                listStyle: 'none',
                padding: 0,
              }}>
                <li style={{ marginBottom: '10px' }}>
                  <Link href="/about" style={{ color: '#ffffff', textDecoration: 'none', transition: 'color 0.3s' }}>About Us</Link>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <Link href="/careers" style={{ color: '#ffffff', textDecoration: 'none', transition: 'color 0.3s' }}>Careers</Link>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <Link href="/contact" style={{ color: '#ffffff', textDecoration: 'none', transition: 'color 0.3s' }}>Contact Us</Link>
                </li>
              </ul>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Title level={5} style={{ color: 'white' }}>Resources</Title>
              <ul style={{
                listStyle: 'none',
                padding: 0,
              }}>
                <li style={{ marginBottom: '10px' }}>
                  <Link href="/blog" style={{ color: '#ffffff', textDecoration: 'none', transition: 'color 0.3s' }}>Blog</Link>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <Link href="/help" style={{ color: '#ffffff', textDecoration: 'none', transition: 'color 0.3s' }}>Help Center</Link>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <Link href="/support" style={{ color: '#ffffff', textDecoration: 'none', transition: 'color 0.3s' }}>Support</Link>
                </li>
              </ul>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Title level={5} style={{ color: 'white' }}>Follow Us</Title>
              <div style={{
                display: 'flex',
                gap: '15px',
                marginTop: '10px',
              }}>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: '#ffffff', fontSize: '24px', transition: 'color 0.3s' }}>
                  <FacebookOutlined />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: '#ffffff', fontSize: '24px', transition: 'color 0.3s' }}>
                  <TwitterOutlined />
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ color: '#ffffff', fontSize: '24px', transition: 'color 0.3s' }}>
                  <GithubOutlined />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: '#ffffff', fontSize: '24px', transition: 'color 0.3s' }}>
                  <LinkedinOutlined />
                </a>
              </div>
            </Col>
          </Row>
          {/* Chân trang */}
          <Paragraph style={{
            textAlign: 'center',
            marginTop: '30px',
            color: '#d9d9d9',
          }}>
            © 2024 Your Company. All Rights Reserved.
          </Paragraph>
        </div>
      </Footer>
    </Layout>
  );
}
