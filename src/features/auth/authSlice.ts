import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '../../app/store';

/**
 * Тип данных для пользователя
 * @typedef {Object} User
 * @property {number} id - ID пользователя
 * @property {string} email - Email пользователя
 */
type User = {
  id: number;
  email: string;
};

/**
 * Тип состояния аутентификации
 * @typedef {Object} AuthState
 * @property {User | null} user - Данные о текущем пользователе
 * @property {boolean} loading - Состояние загрузки
 * @property {string | null} error - Сообщение об ошибке
 */
type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

/**
 * Запрос на вход пользователя
 * @param {Object} credentials - Данные для входа
 * @param {string} credentials.email - Email пользователя
 * @param {string} credentials.password - Пароль пользователя
 * @returns {Promise<User>} - Возвращает данные текущего пользователя
 */
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, thunkAPI) => {
    try {
      await axios.post('/api/v1/auth/login', credentials, { withCredentials: true });
      const response = await axios.get('/api/v1/auth/me', { withCredentials: true });
      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || 'Ошибка входа');
      }
      return thunkAPI.rejectWithValue('Ошибка сервера');
    }
  }
);

/**
 * Запрос на проверку сессии
 * @returns {Promise<User>} - Возвращает данные текущего пользователя
 */
export const fetchMe = createAsyncThunk(
  'auth/fetchMe',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get('/api/v1/auth/me', { withCredentials: true });
      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || 'Ошибка входа');
      }
      return thunkAPI.rejectWithValue('Ошибка сервера');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
          state.user = action.payload;
        })

  },
});

export const { logout } = authSlice.actions;
export const selectUser = (state: RootState) => state.auth.user;
export default authSlice.reducer;
