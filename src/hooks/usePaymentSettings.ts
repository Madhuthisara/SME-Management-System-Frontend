import { useState, useCallback } from 'react';
import type {
    PaymentSetting,
    SavePaymentSettingPayload,
} from '../api/services/paymentSettingsService';
import {
    getPaymentSettings,
    savePaymentSettings,
    togglePaymentGateway,
    deletePaymentSetting,
} from '../api/services/paymentSettingsService';

interface UsePaymentSettingsReturn {
    settings: PaymentSetting[];
    loading: boolean;
    saving: boolean;
    fetchSettings: (businessId: string) => Promise<void>;
    saveSettings: (payload: SavePaymentSettingPayload) => Promise<void>;
    toggleGateway: (id: string) => Promise<void>;
    removeGateway: (id: string) => Promise<void>;
}

const usePaymentSettings = (): UsePaymentSettingsReturn => {
    const [settings, setSettings] = useState<PaymentSetting[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const fetchSettings = useCallback(async (businessId: string) => {
        setLoading(true);
        try {
            const res = await getPaymentSettings(businessId);
            setSettings(res.data?.output ?? []);
        } finally {
            setLoading(false);
        }
    }, []);

    const saveSettings = useCallback(async (payload: SavePaymentSettingPayload) => {
        setSaving(true);
        try {
            await savePaymentSettings(payload);
            // Refresh the list after save
            await fetchSettings(payload.business_id);
        } finally {
            setSaving(false);
        }
    }, [fetchSettings]);

    const toggleGateway = useCallback(async (id: string) => {
        await togglePaymentGateway(id);
        // Optimistic update: flip local state immediately
        setSettings(prev =>
            prev.map(s => s.id === id ? { ...s, is_active: !s.is_active } : s)
        );
    }, []);

    const removeGateway = useCallback(async (id: string) => {
        await deletePaymentSetting(id);
        setSettings(prev => prev.filter(s => s.id !== id));
    }, []);

    return { settings, loading, saving, fetchSettings, saveSettings, toggleGateway, removeGateway };
};

export default usePaymentSettings;
