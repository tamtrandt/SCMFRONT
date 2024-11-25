/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client'

// import React, { useState } from 'react';
// import { Row, Col } from 'antd';
// import { ProductOnChainCard } from './productonchain';
// import { PaginationComponent } from '@/components/componentspage/pagination';


// interface ProductListProps {
//     products: any[];
// }

// const ProductList: React.FC<ProductListProps> = ({ products }) => {
//     const [paginatedProducts, setPaginatedProducts] = useState<any[]>(products.slice(0, 4)); // Mặc định hiển thị 6 sản phẩm mỗi trang

//     const handlePageChange = (paginatedProducts: any[]) => {
//         setPaginatedProducts(paginatedProducts);
//     };

//     return (
//         <div>
//             {products.length === 0 ? (
//                 <p>No products found.</p>
//             ) : (
//                 <>
//                     <Row gutter={[24, 24]}>
//                         {paginatedProducts.map((product) => (
//                             <Col span={6} key={product.id}>
//                                 {/* Gọi ProductOnChainCard cho mỗi sản phẩm */}
//                                 <ProductOnChainCard id={product.id} />
//                             </Col>
//                         ))}
//                     </Row>
//                     <PaginationComponent
//                         products={products}
//                         pageSize={4} // Mỗi trang sẽ hiển thị 6 sản phẩm
//                         onPageChange={handlePageChange}
//                     />
//                 </>
//             )}
//         </div>
//     );
// };

// export default ProductList;
