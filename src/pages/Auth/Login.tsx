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

            const apiResponse = response?.data && response?.success === undefined ? response.data : response;

            console.log("Extracted API Response:", apiResponse);
            const token = apiResponse?.data?.token || apiResponse?.token || apiResponse?.access_token;
            const user = apiResponse?.data?.user || apiResponse?.user;

            let tokenSaved = false;
            console.log("[Login] Token found in parsing:", !!token);
            console.log("[Login] User found in parsing:", !!user);

            if (token && token !== true && token !== "true") {
                setLocalStorageData("token", token);
                console.log("[Login] Token successfully saved to localStorage");
                tokenSaved = true;
            } else {
                console.warn("[Login] No valid token string found. Got:", token);
                console.log("[Login] Full response structure:", JSON.stringify(response).substring(0, 300));
            }

            if (user) {
                setLocalStorageData("user", user);
                console.log("[Login] User data saved to localStorage");
            }
            if (apiResponse?.success || tokenSaved) {
                message.success(apiResponse?.message || "Login successful!");
                console.log(`Login successful. Navigating to ${from}...`);
                setTimeout(() => {
                    navigate(from, { replace: true });
                }, 100);
            } else {
                console.error("Login failed: Backend response indicated failure and no token was provided.");
                message.error(apiResponse?.message || "Login failed. Please check your credentials.");
            }
        },
        onError: (error) => {
            console.error("Login Mutation Error:", error);
            message.error("An error occurred during login. Please try again.");
        }
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
