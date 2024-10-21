'use client';
import { Layout, Row, Col, Typography, Card } from 'antd';
import Image from 'next/image';
import Logo from '@/public/images/Logo.png'
import Back1 from '@/public/images/back1.png'
import { Footer } from 'antd/es/layout/layout';
import { CopyrightOutlined, DoubleRightOutlined, DownOutlined, FacebookOutlined, GithubOutlined, LinkedinOutlined, TwitterOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

export default function HomePage() {
  return (

    <Layout>
      {/* Header */}
      <Header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 20px',
          height: '80px',
          backgroundColor: '#001529',
          backgroundSize: '200%',
          backgroundPosition: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Image
            src={Logo}
            alt="Logo"
            width={50}
            height={50}
            style={{ borderRadius: '50%' }}
          />
          <span
            style={{
              marginLeft: '10px',
              fontSize: '32px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              color: 'white',
              fontFamily: 'Georgia, serif',
              transition: 'color 0.3s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'red')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'white')}
          >
            Adhart Bayer
          </span>
        </div>

        <Link
          href="/auth/login"
          style={{
            fontSize: '17px',
            fontWeight: '600',
            color: 'white',
            textDecoration: 'none',
            fontFamily: 'Verdana, sans-serif',
            transition: 'color 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'red')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'white')}
        >
          Get Started
          <DoubleRightOutlined />
        </Link>
      </Header>
      {/* Hero Section */}
      <Content
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '50px',
          height: '500px',
          backgroundImage: 'linear-gradient(white,)', // Background giống header
          backgroundSize: '200%',
          backgroundPosition: 'center',
        }}
      >
        <div style={{ maxWidth: '50%' }}>
          <Title level={1} style={{ color: '#002766', fontFamily: 'Georgia, serif' }}>
            Welcome to Adhart Bayer
          </Title>
          <Paragraph style={{ fontSize: '18px', lineHeight: '1.6', color: '#333' }}>
            Adhart Bayer is a leading company in <strong>Supply Chain Management</strong>,
            leveraging the power of <strong>blockchain technology</strong> and <strong>QR codes</strong>
            to ensure transparency, traceability, and efficiency in the supply chain.
          </Paragraph>
        </div>

        <Image src={Back1} alt="Hero" width={600} height={400} style={{ borderRadius: '10px' }} />

        {/* d */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            cursor: 'pointer',
            transition: 'transform 0.3s ease',
          }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.3)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <DownOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
        </div>
      </Content>
      {/* Features Section */}
      <Content
        style={{
          padding: '50px',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Row
          gutter={[16, 16]}
          justify="center"
          style={{ textAlign: 'center' }}
        >
          <Col xs={24} sm={12} md={8}>
            <Card
              title="Real-time Tracking"
              bordered={false}
              styles={{
                header: {
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#002766',
                  transition: 'color 0.3s ease',
                },
              }}
              style={{
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                padding: '30px',
                fontFamily: 'Arial, sans-serif',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                const titleElement = e.currentTarget.querySelector('.ant-card-head-title') as HTMLElement;
                if (titleElement) {
                  titleElement.style.color = '#ff4d4f'; // Đổi màu tiêu đề sang đỏ
                }
                e.currentTarget.style.backgroundColor = '#e6f7ff'; // Nền xanh nhạt
              }}
              onMouseLeave={(e) => {
                const titleElement = e.currentTarget.querySelector('.ant-card-head-title') as HTMLElement;
                if (titleElement) {
                  titleElement.style.color = '#002766'; // Trả về màu tiêu đề ban đầu
                }
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              <p style={{ fontSize: '18px', color: '#595959' }}>
                Track your products in real-time with our blockchain-powered system.
              </p>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Card
              title="Seamless QR Code Integration"
              bordered={false}
              styles={{
                header: {
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#002766',
                  transition: 'color 0.3s ease',
                },
              }}
              style={{
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                padding: '30px',
                fontFamily: 'Arial, sans-serif',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                const titleElement = e.currentTarget.querySelector('.ant-card-head-title') as HTMLElement;
                if (titleElement) {
                  titleElement.style.color = '#40a9ff'; // Đổi màu tiêu đề sang xanh
                }
                e.currentTarget.style.backgroundColor = '#fff1f0'; // Nền đỏ nhạt
              }}
              onMouseLeave={(e) => {
                const titleElement = e.currentTarget.querySelector('.ant-card-head-title') as HTMLElement;
                if (titleElement) {
                  titleElement.style.color = '#002766'; // Trả về màu tiêu đề ban đầu
                }
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              <p style={{ fontSize: '18px', color: '#595959' }}>
                Easily generate and scan QR codes to enhance product traceability.
              </p>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Card
              title="Data Security & Transparency"
              bordered={false}
              styles={{
                header: {
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#002766',
                  transition: 'color 0.3s ease',
                },
              }}
              style={{
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                padding: '30px',
                fontFamily: 'Arial, sans-serif',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                const titleElement = e.currentTarget.querySelector('.ant-card-head-title') as HTMLElement;
                if (titleElement) {
                  titleElement.style.color = '#ff7875'; // Đổi màu tiêu đề sang đỏ nhạt
                }
                e.currentTarget.style.backgroundColor = '#f0f5ff'; // Nền xanh nhạt hơn
              }}
              onMouseLeave={(e) => {
                const titleElement = e.currentTarget.querySelector('.ant-card-head-title') as HTMLElement;
                if (titleElement) {
                  titleElement.style.color = '#002766'; // Trả về màu tiêu đề ban đầu
                }
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              <p style={{ fontSize: '18px', color: '#595959' }}>
                Ensure data integrity and transparency across the supply chain.
              </p>
            </Card>
          </Col>
        </Row>
      </Content>
      {/* Footer */}
      <Footer
        style={{
          backgroundColor: '#001529', // Màu nền của footer
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          {/* Các cột chứa link */}
          <Row gutter={[32, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Title level={5} style={{ color: 'white' }}>Product</Title>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '10px' }}>
                  <a
                    href=""
                    style={{
                      color: 'white',
                      textDecoration: 'none',
                      transition: 'color 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'red'} // Đổi màu khi hover
                    onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                  >
                    Features
                  </a>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <a
                    href=""
                    style={{
                      color: 'white',
                      textDecoration: 'none',
                      transition: 'color 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'red'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                  >
                    Pricing
                  </a>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <a
                    href=""
                    style={{
                      color: 'white',
                      textDecoration: 'none',
                      transition: 'color 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'red'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                  >
                    Documentation
                  </a>
                </li>
              </ul>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Title level={5} style={{ color: 'white' }}>Company</Title>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '10px' }}>
                  <a
                    href=""
                    style={{
                      color: 'white',
                      textDecoration: 'none',
                      transition: 'color 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'red'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                  >
                    About Us
                  </a>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <a
                    href=""
                    style={{
                      color: 'white',
                      textDecoration: 'none',
                      transition: 'color 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'red'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                  >
                    Careers
                  </a>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <a
                    href=""
                    style={{
                      color: 'white',
                      textDecoration: 'none',
                      transition: 'color 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'red'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Title level={5} style={{ color: 'white' }}>Resources</Title>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '10px' }}>
                  <a
                    href=""
                    style={{
                      color: 'white',
                      textDecoration: 'none',
                      transition: 'color 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'red'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                  >
                    Blog
                  </a>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <a
                    href=""
                    style={{
                      color: 'white',
                      textDecoration: 'none',
                      transition: 'color 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'red'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                  >
                    Help Center
                  </a>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <a
                    href=""
                    style={{
                      color: 'white',
                      textDecoration: 'none',
                      transition: 'color 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'red'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                  >
                    Support
                  </a>
                </li>
              </ul>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Title level={5} style={{ color: 'white' }}>Follow Us</Title>
              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'white', fontSize: '24px', transition: 'color 0.3s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'red'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                >
                  <FacebookOutlined />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'white', fontSize: '24px', transition: 'color 0.3s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'red'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                >
                  <TwitterOutlined />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'white', fontSize: '24px', transition: 'color 0.3s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'red'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                >
                  <GithubOutlined />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'white', fontSize: '24px', transition: 'color 0.3s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'red'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                >
                  <LinkedinOutlined />
                </a>
              </div>
            </Col>
          </Row>

          {/* FootPage */}
          <Paragraph style={{ textAlign: 'center', marginTop: '30px', color: '#d9d9d9', fontSize: '16px' }}>
            <CopyrightOutlined />2024 ADHART BAYER GmbH. All Rights Reserved.
          </Paragraph>
        </div>
      </Footer>
    </Layout>
  );
}
