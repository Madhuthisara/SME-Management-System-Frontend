/**
 * Theme Examples Component
 * 
 * This component demonstrates various ways to use the centralized theme system.
 * Use this as a reference for implementing consistent styling across the app.
 */

import React from 'react';
import { Button, Card, Typography, Space } from 'antd';
import { theme } from '../styles/theme';

const { Title, Text } = Typography;

const ThemeExamples: React.FC = () => {
    return (
        <div className="p-xl">
            <Title level={1}>Theme System Examples</Title>

            {/* Example 1: Using CSS Variables */}
            <Card className="mb-lg">
                <Title level={3}>1. Using CSS Variables</Title>
                <div
                    style={{
                        backgroundColor: 'var(--color-primary-light)',
                        padding: 'var(--spacing-md)',
                        borderRadius: 'var(--border-radius-base)',
                        color: 'var(--color-primary)',
                        marginBottom: 'var(--spacing-sm)',
                    }}
                >
                    This div uses CSS variables directly in inline styles
                </div>
            </Card>

            {/* Example 2: Using Utility Classes */}
            <Card className="mb-lg">
                <Title level={3}>2. Using Utility Classes</Title>
                <div className="bg-primary-light p-md rounded-base text-primary mb-sm">
                    This div uses custom utility classes
                </div>
                <div className="shadow-base p-lg rounded-lg bg-container">
                    This has shadow and padding from utility classes
                </div>
            </Card>

            {/* Example 3: Using Tailwind Classes */}
            <Card className="mb-lg">
                <Title level={3}>3. Using Tailwind Classes</Title>
                <button className="bg-primary hover:bg-primary-hover text-white px-lg py-sm rounded-md transition-base">
                    Tailwind Styled Button
                </button>
            </Card>

            {/* Example 4: Using TypeScript Theme Constants */}
            <Card className="mb-lg">
                <Title level={3}>4. Using TypeScript Theme Constants</Title>
                <div
                    style={{
                        backgroundColor: theme.colors.warning.bg,
                        padding: theme.spacing.md,
                        borderRadius: theme.borderRadius.lg,
                        fontSize: theme.typography.fontSize.lg,
                        fontWeight: theme.typography.fontWeight.medium,
                        color: theme.colors.warning.main,
                    }}
                >
                    This uses TypeScript theme object with full autocomplete
                </div>
            </Card>

            {/* Example 5: Using Ant Design Components (Already Themed) */}
            <Card className="mb-lg">
                <Title level={3}>5. Using Ant Design Components (Pre-themed)</Title>
                <Space direction="vertical" size="middle">
                    <Button type="primary">Primary Button</Button>
                    <Button type="default">Default Button</Button>
                    <Button type="dashed">Dashed Button</Button>
                    <Button type="link">Link Button</Button>
                    <Button danger>Danger Button</Button>
                </Space>
            </Card>

            {/* Example 6: Typography Examples */}
            <Card className="mb-lg">
                <Title level={3}>6. Typography Examples</Title>
                <Space direction="vertical" size="small">
                    <Title level={1}>Heading 1 (38px)</Title>
                    <Title level={2}>Heading 2 (30px)</Title>
                    <Title level={3}>Heading 3 (24px)</Title>
                    <Title level={4}>Heading 4 (20px)</Title>
                    <Title level={5}>Heading 5 (16px)</Title>
                    <Text>Regular text (14px)</Text>
                    <Text type="secondary">Secondary text</Text>
                    <Text type="success">Success text</Text>
                    <Text type="warning">Warning text</Text>
                    <Text type="danger">Danger text</Text>
                </Space>
            </Card>

            {/* Example 7: Spacing Examples */}
            <Card className="mb-lg">
                <Title level={3}>7. Spacing Examples</Title>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                    <div className="p-xs bg-primary-light">xs (4px)</div>
                    <div className="p-sm bg-primary-light">sm (8px)</div>
                    <div className="p-md bg-primary-light">md (16px)</div>
                    <div className="p-lg bg-primary-light">lg (24px)</div>
                    <div className="p-xl bg-primary-light">xl (32px)</div>
                </div>
            </Card>

            {/* Example 8: Shadow Examples */}
            <Card>
                <Title level={3}>8. Shadow Examples</Title>
                <Space direction="horizontal" size="large">
                    <div className="shadow-sm p-md bg-container rounded-base">
                        Small Shadow
                    </div>
                    <div className="shadow-base p-md bg-container rounded-base">
                        Base Shadow
                    </div>
                    <div className="shadow-lg p-md bg-container rounded-base">
                        Large Shadow
                    </div>
                </Space>
            </Card>
        </div>
    );
};

export default ThemeExamples;
