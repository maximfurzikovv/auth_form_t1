import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import CreateUserPage from '../pages/CreateUserPage';
import EditUserPage from '../pages/EditUserPage';
import Layout from '../components/Layout';
import { useAppSelector } from '../utils/hooks';
import { selectUser } from '../features/auth/authSlice';

export default function AppRouter() {
  const user = useAppSelector(selectUser);
  const isAuth = !!user;

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<Layout />}>
        <Route path="/home" element={isAuth ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/user/create" element={isAuth ? <CreateUserPage /> : <Navigate to="/login" />} />
        <Route path="/user/edit/:id" element={isAuth ? <EditUserPage /> : <Navigate to="/login" />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
