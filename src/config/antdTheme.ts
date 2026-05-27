/**
 * Ant Design Theme Configuration
 * 
 * This file configures Ant Design's theme to match our centralized
 * design system. Use this configuration in ConfigProvider.
 */

import type { ThemeConfig } from 'antd';

const antdTheme: ThemeConfig = {
    token: {
        // Color Palette
        colorPrimary: '#00b96b',
        colorSuccess: '#52c41a',
        colorWarning: '#faad14',
        colorError: '#ff4d4f',
        colorInfo: '#00b96b',

        // Text Colors
        colorText: '#000000',
        colorTextSecondary: '#333333',
        colorTextTertiary: '#666666',
        colorTextQuaternary: '#999999',

        // Background Colors
        colorBgBase: '#ffffff',
        colorBgContainer: '#ffffff',
        colorBgElevated: '#ffffff',
        colorBgLayout: '#f5f5f5',
        colorBgSpotlight: '#fafafa',

        // Border Colors
        colorBorder: '#d9d9d9',
        colorBorderSecondary: '#f0f0f0',

        // Typography
        fontSize: 14,
        fontSizeHeading1: 38,
        fontSizeHeading2: 30,
        fontSizeHeading3: 24,
        fontSizeHeading4: 20,
        fontSizeHeading5: 16,

        fontWeightStrong: 600,

        lineHeight: 1.5,
        lineHeightHeading1: 1.2,
        lineHeightHeading2: 1.2,
        lineHeightHeading3: 1.2,
        lineHeightHeading4: 1.2,
        lineHeightHeading5: 1.2,

        // Spacing
        padding: 16,
        paddingXS: 8,
        paddingSM: 12,
        paddingMD: 16,
        paddingLG: 24,
        paddingXL: 32,

        margin: 16,
        marginXS: 8,
        marginSM: 12,
        marginMD: 16,
        marginLG: 24,
        marginXL: 32,

        // Border Radius
        borderRadius: 6,
        borderRadiusSM: 4,
        borderRadiusLG: 8,
        borderRadiusXS: 2,

        // Control Heights
        controlHeight: 32,
        controlHeightSM: 24,
        controlHeightLG: 40,

        // Shadows
        boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
        boxShadowSecondary: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',

        // Motion
        motionDurationFast: '0.1s',
        motionDurationMid: '0.2s',
        motionDurationSlow: '0.3s',
    },

    components: {
        Select: {
            // Select specific customizations
            controlHeight: 32,
            controlHeightLG: 40,
            controlHeightSM: 24,
            fontSize: 14,
            borderRadius: 6,
        },

        Card: {
            // Card specific customizations
            borderRadiusLG: 8,
            paddingLG: 24,
        },

        Table: {
            // Table specific customizations
            borderRadius: 6,
            fontSize: 14,
        },

        Modal: {
            // Modal specific customizations
            borderRadiusLG: 8,
            paddingLG: 24,
        },
    },
};

export default antdTheme;
