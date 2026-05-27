export interface Attribute {
    attribute_id: string;
    business_id: string;
    name: string;
    created_at: string;
    updated_at: string;
    options?: AttributeOption[]; // Options now come with the attribute
}

export interface CreateAttributePayload {
    business_id: string;
    name: string;
}

export interface UpdateAttributePayload {
    attribute_id: string;
    name: string;
}

export interface AttributeResponse {
    success: boolean;
    message: string;
    output: Attribute;
}

import { PaginatedData } from './pagination';

export interface AttributesListResponse {
    success: boolean;
    message: string;
    output: PaginatedData<Attribute>;
}

export interface AttributeOption {
    option_id: string;
    attribute_id: string;
    name: string;
    code: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateAttributeOptionPayload {
    attribute_id: string;
    name: string;
    code: string;
    description?: string;
}

export interface UpdateAttributeOptionPayload {
    option_id: string;
    name: string;
    code: string;
    description?: string;
}

export interface AttributeOptionResponse {
    success: boolean;
    message: string;
    output: AttributeOption;
}

export interface AttributeOptionsListResponse {
    success: boolean;
    message: string;
    output: AttributeOption[];
}
