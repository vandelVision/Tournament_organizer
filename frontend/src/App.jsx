import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import TournamentPage from "./pages/TournamentPage";
import Contact from "./pages/Contact";
import LoginPage from "./pages/Login";
import HostAuth from "./pages/HostAuth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/tournaments",
    element: <TournamentPage />,
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
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
