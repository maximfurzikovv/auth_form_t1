import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import { fetchMe, selectUser } from '../features/auth/authSlice';
import { useLocation, useNavigate } from 'react-router-dom';

export function useAuthGuard() {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      dispatch(fetchMe()).unwrap().catch(() => {
        if (location.pathname !== '/login') {
          navigate('/login');
        }
      });
    }
  }, [dispatch, user, navigate, location.pathname]);
}
