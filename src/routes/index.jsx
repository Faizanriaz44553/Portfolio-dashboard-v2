import React, { useState } from "react";
import { Button, Drawer, Grid, Layout } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import Login from "../pages/login/Login.jsx";
import AddProjects from "../pages/Add-Projects/Add-Projects.jsx";
import AddAbout from "../pages/Add-About/Add-About.jsx";
import AddCertificate from "../pages/Add-Certificate/Add-Certificate.jsx";
import AddHeader from "../pages/Add-Header/Add-Header.jsx";
import Comments from "../pages/Comments/Comments.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import GuestRoute from "../components/GuestRoute.jsx";
import Navbar from "../components/Navbar/Navbar.jsx";
import AllProjects from "../pages/All-Projects/All-projects.jsx";

const { Content, Header } = Layout;
const { useBreakpoint } = Grid;

const SIDEBAR_WIDTH = 240;
const COLLAPSED_WIDTH = 80;

const DashboardLayout = ({ children }) => {
  const screens = useBreakpoint();
  const isMobileView = !screens.md;
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const contentMarginLeft = isMobileView ? 0 : collapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  return (
    <Layout className="dashboard-layout">
      {!isMobileView && (
        <Navbar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobile={false}
        />
      )}

      {isMobileView && (
        <>
          <Header className="dashboard-mobile-header">
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setMobileOpen(true)}
              className="dashboard-mobile-menu-button"
            />
            <span className="dashboard-mobile-title">Dashboard</span>
          </Header>

          <Drawer
            placement="left"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            closable={false}
            width={SIDEBAR_WIDTH}
            styles={{ body: { padding: 0 } }}
            maskClosable
            zIndex={1100}
          >
            <Navbar
              collapsed={false}
              setCollapsed={() => {}}
              mobile
              onClose={() => setMobileOpen(false)}
            />
          </Drawer>
        </>
      )}

      <Content
        className="dashboard-content"
        style={{
          marginLeft: contentMarginLeft,
          transition: "margin-left 0.2s ease, width 0.2s ease",
        }}
      >
        {children}
      </Content>
    </Layout>
  );
};

const RoutesPath = [
  {
    path: "/",
    element: (
      <GuestRoute>
        <Login />
      </GuestRoute>
    ),
  },
  {
    path: "/add-projects",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <AddProjects />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/all-projects",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <AllProjects />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/add-about",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <AddAbout />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/add-certificate",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <AddCertificate />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/add-header",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <AddHeader />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/comments",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <Comments />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <GuestRoute>
        <Login />
      </GuestRoute>
    ),
  },
];

export default RoutesPath;
