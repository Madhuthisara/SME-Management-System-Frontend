import React from "react";
import { Form, Input, Button, Card, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authService } from "../../api/services/authService";
import { setLocalStorageData } from "../../utils/storage";

const { Title, Text } = Typography;


const Login: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/dashboard";

    const { mutate: login, isPending } = useMutation({
        mutationFn: authService.login,
        onSuccess: (response) => {
            // response is the body returned by authService.login (response.data from axios)
            const { output } = response;
            if (output && output.access_token) {
                setLocalStorageData("token", output.access_token);
            }
            if (output && output.user) {
                setLocalStorageData("user", output.user);
            }
            navigate(from, { replace: true });
        },

    });


    const onFinish = (values: any) => {
        login(values);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Card className="w-full max-w-md shadow-lg rounded-lg">
                <div className="text-center mb-6">
                    <Title level={2}>Login</Title>
                    <p className="text-common-third">
                        Welcome back! Please enter your details.
                    </p>
                </div>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: "Please input your Email!" },
                            { type: "email", message: "Please enter a valid email!" },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            placeholder="Email"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: "Please input your Password!" }]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full"
                            loading={isPending}
                        >
                            Log in
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center' }}>
                        <Text>
                            Don't have an account? <Link to="/signup">Register</Link>
                        </Text>
                    </div>

                </Form>
            </Card>
        </div>
    );
};

export default Login;
