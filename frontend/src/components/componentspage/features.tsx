import React, { useState } from 'react';

interface SearchFilterProps {
    onSearch: (searchTerm: string) => void;
    onSort: (sortOrder: 'asc' | 'desc') => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ onSearch, onSort }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        onSearch(e.target.value);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onSort(e.target.value as 'asc' | 'desc');
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <input
                type="text"
                placeholder="Search by product name..."
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ padding: '8px', width: '200px' }}
            />
            <select onChange={handleSortChange} style={{ padding: '8px' }}>
                <option value="">Sort by</option>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
            </select>
        </div>
    );
};

export default SearchFilter;
