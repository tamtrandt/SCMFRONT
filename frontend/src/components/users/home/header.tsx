
'use client';
import { Layout } from 'antd';
import { HomeOutlined, ShoppingCartOutlined, ProfileOutlined, ShoppingOutlined, SearchOutlined } from '@ant-design/icons'; // Import các icon từ Antd
import Image from 'next/image';
import Logo from '@/public/images/logo.jpg';
import Link from 'next/link';
import { useState } from 'react';

const { Header } = Layout;


export default function AppHeader() {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);


    const menuItems = [
        { key: '1', label: 'Home', icon: <HomeOutlined />, link: '' },
        { key: '2', label: 'Products', icon: <ShoppingOutlined />, link: '' },
        { key: '3', label: 'Orders', icon: <ShoppingCartOutlined />, link: '' },
        { key: '4', label: 'Profile', icon: <ProfileOutlined />, link: '' },
    ];

    const [searchTerm, setSearchTerm] = useState('');

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
        (e.target as HTMLButtonElement).style.backgroundColor = '#0056b3'; // Hiệu ứng hover cho nút
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
        (e.target as HTMLButtonElement).style.backgroundColor = '#007bff';
    };

    const handleClick = () => {
        // Thực hiện tìm kiếm với searchTerm
        console.log(`Searching for: ${searchTerm}`);
    };

    return (
        <Header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 20px',
            backgroundColor: '#001529',
        }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center' }}>

                <Image
                    src={Logo}
                    alt="Logo"
                    width={50}
                    height={50}
                    style={{
                        borderRadius: '50%',
                        cursor: 'pointer',
                        transition: 'transform 0.3s ease',
                    }} // Hiệu ứng hover cho logo
                />

            </div>

            {/* Menu items với thẻ div và hiệu ứng hover, căn giữa, có icon */}
            <div style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                gap: '30px',
            }}>
                {menuItems.map(item => (
                    <Link href={item.link} key={item.key}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                color: hoveredItem === item.key ? '#40a9ff' : 'white', // Thay đổi màu khi hover
                                fontSize: '16px',
                                padding: '0 15px',
                                cursor: 'pointer',
                                transition: 'color 0.3s ease, transform 0.3s ease',
                                transform: hoveredItem === item.key ? 'scale(1.1)' : 'scale(1)', // Phóng to khi hover
                            }}
                            onMouseEnter={() => setHoveredItem(item.key)}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            {item.icon} {/* Hiển thị icon bên cạnh label */}
                            <span style={{ marginLeft: '8px' }}>{item.label}</span> {/* Khoảng cách giữa icon và text */}
                        </div>
                    </Link>
                ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '300px',
                        marginRight: '10px',
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        outline: 'none',
                        transition: 'box-shadow 0.3s ease',
                    }}
                    onFocus={(e) => e.target.style.boxShadow = '0 0 10px #40a9ff'}
                    onBlur={(e) => e.target.style.boxShadow = 'none'}
                />
                <button
                    style={{
                        padding: '10px 15px',
                        border: 'none',
                        borderRadius: '5px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease',
                    }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleClick}
                    title="Submit form"
                >
                    <SearchOutlined />
                </button>
            </div>

        </Header>
    );
}
