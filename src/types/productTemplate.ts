export interface BOMItem {
    material_id: string;
    quantity: number;
}

export interface ProductTemplate {
    id: string;
    name: string;
    materials: BOMItem[];
    primary_material_id?: string;
    created_at?: string;
    updated_at?: string;
}

export interface CreateProductTemplatePayload {
    business_id: string;
    name: string;
    materials: BOMItem[];
    primary_material_id?: string;
}

export interface UpdateProductTemplatePayload {
    id: string;
    name: string;
    materials: BOMItem[];
    primary_material_id?: string;
}

export interface ProductTemplateResponse {
    success: boolean;
    message: string;
    output: ProductTemplate;
}

import { PaginatedData } from './pagination';

export interface ProductTemplatesListResponse {
    success: boolean;
    message: string;
    output: PaginatedData<ProductTemplate>;
}
