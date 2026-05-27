import React from 'react';
import { Form, Input, Button } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { profileService } from '../../../api/services/profileService';

const SecurityForm: React.FC = () => {
    const [form] = Form.useForm();

    const { mutate: changePassword, isPending } = useMutation({
        mutationFn: (payload: any) => profileService.changePassword(payload, {
            _showSuccessMessage: true,
            _showErrorMessage: true
        } as any),
        onSuccess: () => {
            form.resetFields();
        },
    });

    const onFinish = (values: any) => {
        const payload = {
            current_password: values.current_password,
            new_password: values.new_password,
            new_password_confirmation: values.new_password_confirmation,
        };
        changePassword(payload);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
        >
            <Form.Item
                name="current_password"
                label="Current Password"
                rules={[{ required: true, message: 'Please enter your current password' }]}
            >
                <Input.Password placeholder="Current Password" />
            </Form.Item>

            <Form.Item
                name="new_password"
                label="New Password"
                rules={[
                    { required: true, message: 'Please enter your new password' },
                    { min: 6, message: 'Password must be at least 6 characters' },
                ]}
            >
                <Input.Password placeholder="New Password" />
            </Form.Item>

            <Form.Item
                name="new_password_confirmation"
                label="Confirm New Password"
                dependencies={['new_password']}
                hasFeedback
                rules={[
                    { required: true, message: 'Please confirm your new password' },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('new_password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('The two passwords that you entered do not match!'));
                        },
                    }),
                ]}
            >
                <Input.Password placeholder="Confirm New Password" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={isPending}>
                    Change Password
                </Button>
            </Form.Item>
        </Form>
    );
};

export default SecurityForm;
