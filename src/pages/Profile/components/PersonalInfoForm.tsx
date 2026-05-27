import React, { useEffect } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../../../api/services/profileService';
import { User } from '../../../types/profile';

interface PersonalInfoFormProps {
    initialValues: User;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ initialValues }) => {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const { mutate: updatePersonal, isPending } = useMutation({
        mutationFn: (values: any) => profileService.updatePersonal(values, {
            _showSuccessMessage: true,
            _showErrorMessage: true
        } as any),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
    });

    useEffect(() => {
        form.setFieldsValue({
            full_name: initialValues.full_name,
            email: initialValues.email,
            mobile_number: initialValues.mobile_number,
        });
    }, [initialValues, form]);

    const onFinish = (values: any) => {
        updatePersonal(values);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
        >
            <Row gutter={16}>
                <Col span={24}>
                    <Form.Item
                        name="full_name"
                        label="Full Name"
                        rules={[{ required: true, message: 'Please enter your full name' }]}
                    >
                        <Input placeholder="Full Name" />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Please enter your email' },
                            { type: 'email', message: 'Please enter a valid email' },
                        ]}
                    >
                        <Input placeholder="Email" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="mobile_number"
                        label="Mobile Number"
                        rules={[{ required: true, message: 'Please enter your mobile number' }]}
                    >
                        <Input style={{ width: '100%' }} placeholder="Mobile Number" />
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

export default PersonalInfoForm;
