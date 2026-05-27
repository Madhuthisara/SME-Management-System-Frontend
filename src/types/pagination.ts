export interface PaginatedData<T> {
    values: T[];
    total_records: number;
    current_page: number;
    per_page: number;
}
