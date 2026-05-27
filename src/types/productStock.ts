import { ProductTemplate } from './productTemplate';
import { Material } from './material';
import { MaterialStock } from './materialStock';

export interface ProductStockMaterial {
    id: string;
    product_stock_id: string;
    material_id: string;
    material_stock_id: string;
    quantity_used: string;
    material: Material;
    material_stock: MaterialStock;
}

export interface ProductStock {
    id: string;
    business_id: string;
    product_id: string;
    batch_id: string | null;
    quantity: string;
    reorder_level: string;
    notes: string | null;
    created_at: string;
    updated_at: string;
    product: any;
    attribute_options: any[];
    stock_materials: ProductStockMaterial[];
}

export interface CreateProductStockPayload {
    business_id: string;
    product_id: string;
    batch_id?: string;
    quantity: number;
    reorder_level: number;
    notes?: string;
    materials: {
        material_id: string;
        material_stock_id: string;
    }[];
}

export interface ProductStockResponse {
    success: boolean;
    message: string;
    output: ProductStock;
}

import { PaginatedData } from './pagination';

export interface ProductStocksListResponse {
    success: boolean;
    message: string;
    output: PaginatedData<ProductStock>;
}
