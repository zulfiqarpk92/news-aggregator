import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import useUsersStore from "../stores/users";
import Settings from "../pages/Settings";

function ProtectedRoute({ children, redirectTo }) {
  const isAuthenticated = useUsersStore((state) => state.isAuthenticated);
  return isAuthenticated() ? children : <Navigate to={redirectTo} />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute redirectTo="/login">
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export default router;
