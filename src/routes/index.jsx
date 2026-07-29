import Login from "../pages/login/Login.jsx";
import AddProjects from "../pages/Add-Projects/Add-Projects.jsx";
import AddAbout from "../pages/Add-About/Add-About.jsx";
import AddCertificate from "../pages/Add-Certificate/Add-Certificate.jsx";
import AddHeader from "../pages/Add-Header/Add-Header.jsx";
import Comments from "../pages/Comments/Comments.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx"
import GuestRoute from "../components/GuestRoute.jsx";
import Navbar from "../components/Navbar/Navbar.jsx";

const DashboardLayout = ({ children }) => (
  <div style={{ display: "flex", minHeight: "100vh" }}>
   <Navbar/>
    <main style={{ flex: 1, padding: 24 }}>
      {children}
    </main>
  </div>
);

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
    element:(
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
    element:(
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
  )
  },
];

export default RoutesPath;
