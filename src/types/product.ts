import { Category } from './category';
import { ProductTemplate } from './productTemplate';

export interface ProductImage {
    id: string;
    product_id: string;
    image_url: string;
}

export interface Product {
    id: string;
    business_id: string;
    category_id: string;
    product_template_id: string | null;
    name: string;
    description: string | null;
    sku: string;
    base_price: string;
    discount: string;
    thumbnail_url: string | null;
    created_at: string;
    updated_at: string;
    category?: Category;
    product_template?: ProductTemplate;
    images?: ProductImage[];
}

export interface CreateProductPayload {
    business_id: string;
    category_id: string;
    product_template_id?: string | null;
    name: string;
    description?: string;
    sku: string;
    base_price: number;
    discount?: number;
    thumbnail_url?: string;
    gallery?: string[];
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {
    id?: string;
}

import { PaginatedData } from './pagination';

export interface ProductsListResponse {
    success: boolean;
    message: string;
    output: PaginatedData<Product>;
}

export interface ProductResponse {
    success: boolean;
    message: string;
    output: Product;
}
