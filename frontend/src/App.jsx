import { createBrowserRouter, Outlet, RouterProvider, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import Home from "./pages/Home";
import TournamentPage from "./pages/TournamentPage";
import TournamentDetails from "./pages/TournamentDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import Contact from "./pages/Contact";
import LoginPage from "./pages/Login";
import HostAuth from "./pages/HostAuth";
import PlayerDashboard from "./components/player/PlayerDashboard";
import HostDashboard from "./components/host/HostDashboard";
import HostApp from "./components/host/HostApp";

// Layout component that handles scroll restoration
function Layout() {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      {/* Global toast container */}
      <Toaster position="top-center" reverseOrder={false} />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/tournaments",
        element: <TournamentPage />,
      },
      {
        path: "/tournament/:id",
        element: (
          <ProtectedRoute>
            <TournamentDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/access/hp-portal",
        element: <HostAuth />,
      },
      {
        path: "/player/:id/dashboard",
        element: <PlayerDashboard />
      },
      {
        path: "/host/:id/dashboard",
        element: <HostApp />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
