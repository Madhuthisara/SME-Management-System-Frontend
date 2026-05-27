import React, { useEffect } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../../../api/services/profileService';
import { Business } from '../../../types/profile';

interface CompanyInfoFormProps {
    initialValues: Business;
}

const CompanyInfoForm: React.FC<CompanyInfoFormProps> = ({ initialValues }) => {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const { mutate: updateCompany, isPending } = useMutation({
        mutationFn: (values: any) => profileService.updateCompany(values, {
            _showSuccessMessage: true,
            _showErrorMessage: true
        } as any),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
    });

    useEffect(() => {
        form.setFieldsValue({
            business_name: initialValues.business_name,
            business_email: initialValues.business_email,
            business_phone: initialValues.business_phone,
            business_address: initialValues.business_address,
            tax_id: initialValues.tax_id,
            website: initialValues.website,
            br_number: initialValues.br_number,
        });
    }, [initialValues, form]);

    const onFinish = (values: any) => {
        updateCompany(values);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
        >
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="business_name"
                        label="Business Name"
                        rules={[{ required: true, message: 'Please enter business name' }]}
                    >
                        <Input placeholder="Business Name" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="br_number"
                        label="BR Number"
                        rules={[{ required: true, message: 'Please enter BR number' }]}
                    >
                        <Input placeholder="BR Number" />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="business_email"
                        label="Business Email"
                        rules={[
                            { required: true, message: 'Please enter business email' },
                            { type: 'email', message: 'Please enter a valid email' },
                        ]}
                    >
                        <Input placeholder="Business Email" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="business_phone"
                        label="Business Phone"
                        rules={[{ required: true, message: 'Please enter business phone' }]}
                    >
                        <Input placeholder="Business Phone" />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={24}>
                    <Form.Item
                        name="business_address"
                        label="Business Address"
                        rules={[{ required: true, message: 'Please enter address' }]}
                    >
                        <Input.TextArea rows={3} placeholder="Address" />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="tax_id"
                        label="Tax ID"
                    >
                        <Input placeholder="Tax ID" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="website"
                        label="Website"
                        rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
                    >
                        <Input placeholder="https://www.example.com" />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={isPending}>
                    Save Changes
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CompanyInfoForm;
