import React, { useState } from 'react';
import { Form, Input, Button, Steps, Card, Typography, message, theme } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, ShopOutlined, EnvironmentOutlined, FileTextOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';
import { authService } from '../../api/services/authService';

const { Title, Text } = Typography;

const Signup: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { mutate: register, isPending } = useMutation({
        mutationFn: authService.register,
        onSuccess: () => {
            navigate('/login');
        },
    });



    const onNext = async () => {
        try {
            await form.validateFields(['full_name', 'email', 'mobile_number', 'password', 'password_confirmation']);
            setCurrentStep(1);
        } catch (error) {
            // Validation failed
        }
    };


    const onPrev = () => {
        setCurrentStep(0);
    };

    const onFinish = async (values: any) => {
        register(values);
    };



    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
            <Card style={{ width: 600, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Title level={2}>Super Admin Registration</Title>
                    <Text type="secondary">Create your account and set up your business</Text>
                </div>

                <Steps
                    current={currentStep}
                    style={{ marginBottom: 24 }}
                    items={[
                        {
                            title: 'Account Details',
                            icon: <UserOutlined />,
                        },
                        {
                            title: 'Business Identity',
                            icon: <ShopOutlined />,
                        },
                    ]}
                />

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{}}
                >
                    {/* Step 1: Admin Account Details */}
                    <div style={{ display: currentStep === 0 ? 'block' : 'none' }}>
                        <Form.Item
                            name="full_name"
                            label="Full Name"
                            rules={[{ required: true, message: 'Please enter your full name' }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="John Doe" size="large" />
                        </Form.Item>


                        <Form.Item
                            name="email"
                            label="Email Address"
                            rules={[
                                { required: true, message: 'Please enter your email' },
                                { type: 'email', message: 'Please enter a valid email' },
                            ]}
                        >
                            <Input prefix={<MailOutlined />} placeholder="john@example.com" size="large" />
                        </Form.Item>

                        <Form.Item
                            name="mobile_number"
                            label="Mobile Number"
                            rules={[
                                { required: true, message: 'Please enter your mobile number' },
                                { pattern: /^[0-9]{10}$/, message: 'Mobile number must be 10 digits' },
                            ]}
                        >
                            <Input prefix={<PhoneOutlined />} placeholder="0712345678" maxLength={10} size="large" />
                        </Form.Item>


                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[
                                { required: true, message: 'Please enter your password' },
                                { min: 8, message: 'Password must be at least 8 characters' },
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
                        </Form.Item>

                        <Form.Item
                            name="password_confirmation"
                            label="Confirm Password"
                            dependencies={['password']}
                            rules={[
                                { required: true, message: 'Please confirm your password' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" size="large" />
                        </Form.Item>


                        <Button type="primary" onClick={onNext} block size="large" style={{ marginTop: 16 }}>
                            Next
                        </Button>
                        <div style={{ textAlign: 'center', marginTop: 16 }}>
                            <Text>Already have an account? <Link to="/login">Login</Link></Text>
                        </div>

                    </div>

                    {/* Step 2: Core Business Details */}
                    <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
                        <Form.Item
                            name="business_name"
                            label="Business Name"
                            rules={[{ required: true, message: 'Please enter your business name' }]}
                        >
                            <Input prefix={<ShopOutlined />} placeholder="My Awesome Business" size="large" />
                        </Form.Item>


                        <Form.Item
                            name="business_address"
                            label="Business Address"
                            rules={[{ required: true, message: 'Please enter your business address' }]}
                        >
                            <Input.TextArea placeholder="123 Business St, City, Country" rows={3} size="large" />
                        </Form.Item>


                        <Form.Item
                            name="business_email"
                            label="Business Email"
                            rules={[
                                { required: true, message: 'Please enter your business email' },
                                { type: 'email', message: 'Please enter a valid email' },
                            ]}
                        >
                            <Input prefix={<MailOutlined />} placeholder="contact@business.com" size="large" />
                        </Form.Item>


                        <Form.Item
                            name="business_phone"
                            label="Business Phone"
                            rules={[
                                { required: true, message: 'Please enter your business phone number' },
                                { pattern: /^[0-9]{10}$/, message: 'Phone number must be 10 digits' },
                            ]}
                        >
                            <Input prefix={<PhoneOutlined />} placeholder="0112345678" maxLength={10} size="large" />
                        </Form.Item>


                        <Form.Item
                            name="br_number"
                            label="BR Number"
                            rules={[{ required: true, message: 'Please enter your Business Registration Number' }]}
                        >
                            <Input prefix={<FileTextOutlined />} placeholder="BR-123456" size="large" />
                        </Form.Item>


                        <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
                            <Button onClick={onPrev} size="large" style={{ flex: 1 }}>
                                Back
                            </Button>
                            <Button type="primary" htmlType="submit" loading={isPending} size="large" style={{ flex: 1 }}>
                                Complete Setup
                            </Button>
                        </div>

                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Signup;
