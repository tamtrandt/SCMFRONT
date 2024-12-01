/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState } from 'react';
import { Button, Input, message } from 'antd';

interface PaginationProps {
    products: any[];
    pageSize: number;
    onPageChange: (paginatedProducts: any[]) => void;
}

export const PaginationComponent = ({ products, pageSize, onPageChange }: PaginationProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [inputPage, setInputPage] = useState<string>('');
    const totalPages = Math.ceil(products.length / pageSize);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        onPageChange(products.slice(start, end));
    };

    const handleGoToPage = () => {
        const pageNumber = Number(inputPage);
        if (pageNumber > 0 && pageNumber <= totalPages) {
            handlePageChange(pageNumber);
            setInputPage('');
        } else {
            message.error(`Please enter a valid page number between 1 and ${totalPages}`);
        }
    };

    return (
        <div style={{
            textAlign: 'center',
            marginTop: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{ marginRight: '20px' }}
            >
                {"<<<"}
            </Button>
            <p style={{ margin: '0 20px', fontWeight: 'bold' }}>
                {currentPage}/{totalPages}
            </p>
            <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{ marginLeft: '20px' }}
            >
                {">>>"}
            </Button>

            <div style={{ marginLeft: '20px' }}>
                <Input
                    type="number"
                    value={inputPage}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || /^[1-9]\d*$/.test(value)) {
                            setInputPage(value);
                        }
                    }}
                    placeholder="Page"
                    style={{
                        width: '70px',
                        marginRight: '8px',
                        borderRadius: '4px',
                        border: '1px solid #d9d9d9'
                    }}
                />
                <Button
                    onClick={handleGoToPage}
                    style={{ borderRadius: '4px', backgroundColor: '#4caf50', color: '#fff' }}
                >
                    Go
                </Button>
            </div>
        </div>
    );
};


