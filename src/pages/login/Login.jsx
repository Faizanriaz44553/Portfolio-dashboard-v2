// src/pages/Login.jsx

import React from "react";
import { Form, Input, Button, Card } from "antd";
import { Controller, useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "../../../firebase.config";

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

    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f2f5",
      }}
    >
      <Card
        title="Login"
        style={{
          width: 350,
          boxShadow: "0 0 15px rgba(0,0,0,0.1)",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Form.Item label="Email">
            <Controller
              name="email"
              control={control}
              rules={{ required: "Email is required" }}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>

          <Form.Item label="Password">
            <Controller
              name="password"
              control={control}
              rules={{ required: "Password is required" }}
              render={({ field }) => <Input.Password {...field} />}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Sign In
            </Button>
          </Form.Item>
        </form>
      </Card>

      <ToastContainer position="top-center" />
    </div>
  );
};

export default Login;