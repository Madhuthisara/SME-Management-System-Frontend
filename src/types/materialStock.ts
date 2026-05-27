import { Material } from './material';
import { AttributeOption } from './attribute';
import { Supplier } from './supplier';

export interface MaterialStockAttributeOption extends AttributeOption {
    pivot: {
        stock_id: string;
        option_id: string;
    };
}

export interface MaterialStock {
    stock_id: string;
    business_id: string;
    material_id: string;
    supplier_id: string | null;
    quantity: string;
    unit_cost: string;
    reorder_level: string;
    sku: string;
    created_at: string;
    updated_at: string;
    material: Material;
    supplier?: Supplier;
    attribute_options: MaterialStockAttributeOption[];
}

export interface CreateMaterialStockPayload {
    business_id: string;
    material_id: string;
    supplier_id?: string;
    quantity: number;
    unit_cost?: number;
    reorder_level: number;
    sku: string;
    attribute_options: string[]; // Array of option IDs
}

export interface UpdateMaterialStockPayload {
    stock_id: string;
    supplier_id?: string;
    quantity: number;
    unit_cost?: number;
    reorder_level: number;
    sku: string;
    attribute_options: string[]; // Array of option IDs
}

export interface MaterialStockResponse {
    success: boolean;
    message: string;
    output: MaterialStock;
}

import { PaginatedData } from './pagination';

export interface MaterialStocksListResponse {
    success: boolean;
    message: string;
    output: PaginatedData<MaterialStock>;
}
