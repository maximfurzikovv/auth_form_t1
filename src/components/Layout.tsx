import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, Drawer, Button, List, ListItem } from "@mui/material";
import { useAuthGuard } from '../utils/useAuthGuard';
import { useAppDispatch } from '../utils/hooks';
import { logout } from '../features/auth/authSlice';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import styles from './Layout.module.css';

export function Layout() {
  useAuthGuard(); // Проверка аутентификации пользователя
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Если пользователь на странице логина, показываем только Outlet
  if (location.pathname === "/login") {
    return <Outlet />;
  }

   /**
   * Обработчик выхода из системы.
   * При нажатии на кнопку "Выйти" вызывается этот обработчик, который очищает состояние аутентификации
   * и перенаправляет пользователя на страницу логина.
   */
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: 1300 }} className={styles.header}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" className={styles.title}>
            Панель управления
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Выйти
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" classes={{ paper: styles.sidebar }}>
        <List>
          <ListItem
            component="button"
            className={styles.sidebarButton}
            onClick={() => navigate("/")}
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <HomeIcon sx={{ fontSize: '2rem' }} />
          </ListItem>
          <ListItem
            component="button"
            className={styles.sidebarButton}
            onClick={() => navigate("/user/create")}
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <AddIcon sx={{ fontSize: '2rem' }} />
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" className={styles.main}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;
