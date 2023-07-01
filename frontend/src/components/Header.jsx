import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import useUsersStore from "../stores/users";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const logout = useUsersStore((state) => state.logout);
  const isAuthenticated = useUsersStore((state) => state.isAuthenticated());
  const navigateTo = useNavigate();

  async function logoutUser() {
    await logout();
    navigateTo("/login");
  }

  return (
    <AppBar position="relative">
      <Toolbar>
        <NewspaperIcon sx={{ mr: 2 }} />
        <Typography variant="h6" color="inherit" sx={{ flexGrow: 1 }} noWrap>
          <Link to="/" style={{ color: "unset", textDecoration: "none" }}>
            News Aggregator
          </Link>
        </Typography>
        {!isAuthenticated && (
          <Button
            onClick={() => navigateTo("/login")}
            variant="text"
            color="inherit"
          >
            Log In
          </Button>
        )}
        {isAuthenticated && (
          <Button
            onClick={() => navigateTo("/settings")}
            variant="text"
            color="inherit"
          >
            Settings
          </Button>
        )}
        {isAuthenticated && (
          <Button onClick={logoutUser} variant="text" color="inherit">
            Log Out
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
