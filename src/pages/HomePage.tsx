import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { fetchUsers, deleteUser } from '../features/users/usersSlice';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const users = useAppSelector((state) => state.users.list);
  const loading = useAppSelector((state) => state.users.loading);
  const error = useAppSelector((state) => state.users.error);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Удалить пользователя
  const handleDelete = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      dispatch(deleteUser(id))
    }
  };

  return (
    <TableContainer component={Paper} className={styles.container}>
      <Typography variant="h5" className={styles.title}>
        Список пользователей
      </Typography>

      {loading && <Typography align="center">Загрузка...</Typography>}
      {error && <Typography color="error" align="center">{error}</Typography>}

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Полное имя</TableCell>
            <TableCell>Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={user.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.fullName}</TableCell>
              <TableCell className={styles.actions}>
                <IconButton onClick={() => navigate(`/user/edit/${user.id}`)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(user.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
