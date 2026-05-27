import React from 'react';
import PaymentSettingsPage from '../../../components/PaymentSettings/PaymentSettingsPage';
import { getLocalStorageData } from '../../../utils/storage';

const PaymentMethods: React.FC = () => {
    const user = getLocalStorageData<any>('user') || {};
    const businessId = user.business_id;

    if (!businessId) {
        return <div style={{ padding: 24 }}>Error: Business ID not found in session. Please login again.</div>;
    }

    // PaymentSettingsPage already brings its own Title and layout, replacing the dummy MasterDataSubPageLayout wrapper.
    return (
        <div style={{ padding: '0 24px' }}>
            <PaymentSettingsPage businessId={businessId} />
        </div>
    );
};

export default PaymentMethods;
