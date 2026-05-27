/**
 * Set data to localStorage
 * @param key Storage key
 * @param value Data to store (will be stringified if it's an object)
 */
export const setLocalStorageData = (key: string, value: any): void => {
    try {
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
        localStorage.setItem(key, stringValue);
    } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
    }
};

/**
 * Get data from localStorage
 * @param key Storage key
 * @returns Parsed data or null
 */
export const getLocalStorageData = <T>(key: string): T | null => {
    try {
        const value = localStorage.getItem(key);
        if (!value) return null;

        // Try to parse as JSON, if fails return as string
        try {
            return JSON.parse(value) as T;
        } catch {
            return value as unknown as T;
        }
    } catch (error) {
        console.error(`Error getting localStorage key "${key}":`, error);
        return null;
    }
};

/**
 * Remove data from localStorage
 * @param key Storage key
 */
export const removeLocalStorageData = (key: string): void => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Error removing localStorage key "${key}":`, error);
    }
};

/**
 * Clear all localStorage data
 */
export const clearLocalStorageData = (): void => {
    try {
        localStorage.clear();
    } catch (error) {
        console.error('Error clearing localStorage:', error);
    }
};
