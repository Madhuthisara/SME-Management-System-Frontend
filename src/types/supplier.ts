export interface Supplier {
    id?: string;
    supplier_id?: string;
    business_id: string;
    name: string;
    contact_person: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateSupplierPayload {
    business_id: string;
    name: string;
    contact_person?: string;
    phone?: string;
    email?: string;
    address?: string;
}

export type UpdateSupplierPayload = Partial<CreateSupplierPayload> & { id: string };
