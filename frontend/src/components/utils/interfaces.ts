export interface Login {
    email: string;
    password: string;
    code?: string;
  }


export interface CreateProduct {
    name: string;
    description: string;
    price: number;
    quantity: number;  
    brand: string; 
    category: string;    
    size: string;         
    files: File[];     
}


export interface GetProductOffChain {
    id: string;
    transactionHash: string;
    isDeleted: boolean;
    store: string;
    create_at: Date;
    update_at: Date;
    qrcode: string[];
   
}

export interface GetProductOnChain {
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    brand: string;
    category: string;
    size: string;
    status: string;
    store: string;
    cids: string[];
    creater: string;

}

export interface ProfileData {
    user_id: string;
    username: string;
    email: string;
    phone: string;
    address: string;
    role: string;
    isactive: boolean;
    create_at: string;
}


export interface UpdateUser {
    user_id: string;
    username: string;      
    email: string;         
    password: string;      
    phone: string;         
    address: string;       
    role: string;            
}


export interface User {
    user_id: string;
    username: string;
    email: string;
    id: number;
    phone: string;
    role: 'admin' | 'customer'; 
    isActive: boolean;
    address: string;
    create_at: string;
}


export enum Brand {
    Adidas = 'Adidas',
    Puma = 'Puma',
    Nike = 'Nike',
}
export const sizeOptions = {
    Clothing: ['S', 'M', 'L', 'XL', 'XXL'],
    Shoes: ['40', '41', '42', '43', '44'],
    Pants: ['US 30', 'US 32', 'EU 46', 'EU 48'],
};