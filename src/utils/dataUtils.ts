/**
 * Safely converts potential "associative objects" from PHP/Laravel back into arrays.
 * Ant Design Table fails with "rawData.some is not a function" if dataSource is an object.
 */
export const ensureArray = <T>(data: any): T[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'object') {
        // Check if it looks like an associative array (object with numeric keys)
        return Object.values(data) as T[];
    }
    return [];
};

/**
 * Extracts values from a paginated response safely.
 */
export const extractPaginatedData = <T>(data: any): T[] => {
    const values = data?.values ?? data ?? [];
    return ensureArray<T>(values);
};
