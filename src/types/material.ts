import { Attribute } from './attribute';

export interface MaterialAttribute extends Attribute {
    pivot: {
        material_id: string;
        attribute_id: string;
    };
}

export interface Material {
    mat_id: string;
    business_id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    attributes: MaterialAttribute[];
}

export interface CreateMaterialPayload {
    business_id: string;
    name: string;
    description: string;
    attributes: string[]; // Array of attribute IDs
}

export interface UpdateMaterialPayload {
    mat_id: string;
    name: string;
    description: string;
    attributes: string[]; // Array of attribute IDs
}

export interface MaterialResponse {
    success: boolean;
    message: string;
    output: Material;
}

import { PaginatedData } from './pagination';

export interface MaterialsListResponse {
    success: boolean;
    message: string;
    output: PaginatedData<Material>;
}
