import React from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
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
            console.log("Login API Response:", response);

            // Handle various structures: { output: { ... } }, { data: { ... } }, or direct
            // Ensure we don't pick 'null' if output is present but null
            const data = (response.output !== null && response.output !== undefined)
                ? response.output
                : (response.data || response);

            let tokenSaved = false;
            if (data && (data.access_token || data.token)) {
                const token = data.access_token || data.token;
                setLocalStorageData("token", token);
                console.log("Token successfully saved to localStorage");
                tokenSaved = true;
            } else {
                console.warn("No token found in login response structure. This might be normal for session-based auth.");
                console.log("Structure analyzed:", JSON.stringify(data).substring(0, 200));
            }

            if (data && data.user) {
                setLocalStorageData("user", data.user);
                console.log("User data saved to localStorage");
            } else if (data && data.data && data.data.user) {
                setLocalStorageData("user", data.data.user);
                console.log("User data saved from nested structure");
            }

            // Navigate if success is true OR if we saved a token
            if (response.success || tokenSaved) {
                message.success(response.message || "Login successful!");
                console.log(`Login successful. Navigating to ${from}...`);
                setTimeout(() => {
                    navigate(from, { replace: true });
                }, 100);
            } else {
                console.error("Login failed: Backend response indicated failure and no token was provided.");
                message.error("Login failed. Please check your credentials.");
            }
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
