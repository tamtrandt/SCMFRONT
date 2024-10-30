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


export interface ProductOffChain {
    id: string;
    transactionHash: string;
    qrcode: string[];
    create_at: Date;
    update_at: Date;
    isDeleted: boolean;
    isOnChain: boolean;
}

export interface ProductOnChain {
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    brand: string;
    category: string;
    size: string;
    status: string;
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
