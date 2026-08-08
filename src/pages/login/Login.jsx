import React from "react";
import { Form, Input, Button, message } from "antd";
import {
  LockOutlined,
  MailOutlined,
  DashboardOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { Controller, useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "../../../firebase.config";
import "./Login.css";

const Login = () => {
  const { control, handleSubmit } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const { email, password } = data;

    try {
      await signInWithEmailAndPassword(auth, email, password);

      toast.success("Login successful!");

      setTimeout(() => {
        navigate("/add-projects", { replace: true });
      }, 1000);
       message.success("Logged in successfully");
    } catch (error) {
      message.error("Invalid email or password.");
      console.error(error);
    }
  };

  return (
    <div className="login-main-wrapper">

      <div className="login-container">

        {/* =========================
            LEFT SIDE
        ========================== */}

        <div className="login-info-section">

          <div className="login-brand">
            <div className="login-brand-icon">
              <DashboardOutlined />
            </div>

            <span>Portfolio Dashboard</span>
          </div>

          <div className="login-info-content">

            <span className="login-small-heading">
              ADMIN PANEL
            </span>

            <h1>
              Manage your portfolio
              <span> with ease.</span>
            </h1>

            <p>
              Manage projects, comments, certificates
              and portfolio content from one secure
              dashboard.
            </p>

          </div>

          <div className="login-info-footer">
            <span>
              Secure Admin Access
            </span>

            <span>
              © {new Date().getFullYear()} Portfolio
            </span>
          </div>

        </div>


        {/* =========================
            RIGHT SIDE
        ========================== */}

        <div className="login-form-section">

          <div className="login-form-header">

            <div className="login-mobile-icon">
              <DashboardOutlined />
            </div>

            <h2>
              Welcome back
            </h2>

            <p>
              Sign in to access your dashboard.
            </p>

          </div>


          <Form
            layout="vertical"
            onFinish={handleSubmit(onSubmit)}
            className="login-form"
          >

            {/* EMAIL */}

            <Form.Item label="Email">

              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="large"
                    prefix={<MailOutlined />}
                    placeholder="Enter your email"
                  />
                )}
              />

            </Form.Item>


            {/* PASSWORD */}

            <Form.Item label="Password">

              <Controller
                name="password"
                control={control}
                rules={{
                  required: "Password is required",
                }}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    size="large"
                    prefix={<LockOutlined />}
                    placeholder="Enter your password"
                  />
                )}
              />

            </Form.Item>


            {/* LOGIN BUTTON */}

            <Form.Item className="login-button-wrapper">

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                icon={<ArrowRightOutlined />}
                iconPosition="end"
                className="login-submit-button"
              >
                Sign In
              </Button>

            </Form.Item>

          </Form>


          <div className="login-security-note">
            <LockOutlined />

            <span>
              Your account is protected with secure authentication.
            </span>
          </div>

        </div>

      </div>


      <ToastContainer
        position="top-center"
        autoClose={2500}
      />

    </div>
  );
};

export default Login;