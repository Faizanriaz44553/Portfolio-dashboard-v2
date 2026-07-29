import React, { useState } from "react";
import {
  AppstoreOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MessageOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import "../../styles/globals.css"

const { Sider } = Layout;

const Navbar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      setIsSubmitting(true);
      await signOut(auth);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const items = [
    {
      key: "/add-projects",
      icon: <FolderOpenOutlined />,
      label: <Link to="/add-projects">Add Projects</Link>,
    },
    {
      key: "/add-about",
      icon: <UserOutlined />,
      label: <Link to="/add-about">Add About</Link>,
    },
    {
      key: "/add-certificate",
      icon: <FileTextOutlined />,
      label: <Link to="/add-certificate">Add Certificate</Link>,
    },
    {
      key: "/add-header",
      icon: <AppstoreOutlined />,
      label: <Link to="/add-header">Add Header</Link>,
    },
    {
      key: "/comments",
      icon: <MessageOutlined />,
      label: <Link to="/comments">Comments</Link>,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: isSubmitting ? "Signing out..." : "Logout",
      danger: true, // Clean Red Highlight for Logout
    },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      handleLogout();
    }
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={240}
      style={{
        minHeight: "100vh",
        position: "sticky",
        top: 0,
        left: 0,
        boxShadow: "2px 0 8px 0 rgba(29,35,41,.05)",
      }}
    >
      {/* Top Header / Toggle Container */}
      <div
        style={{
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          padding: "0 16px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {!collapsed && (
          <span
            style={{
              color: "#fff",
              fontSize: "16px",
              fontWeight: "600",
              whiteSpace: "nowrap",
            }}
          >
            Dashboard
          </span>
        )}
        <Button
          type="text"
          onClick={() => setCollapsed(!collapsed)}
          style={{
            color: "#fff",
            fontSize: "16px",
            width: 32,
            height: 32,
          }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
      </div>

      {/* Navigation Items */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={items}
        onClick={handleMenuClick}
        style={{ borderRight: 0, marginTop: "8px" }}
      />
    </Sider>
  );
};

export default Navbar;