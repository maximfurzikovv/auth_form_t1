import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

/**
 * Тип данных для пользователя
 * @typedef {Object} User
 * @property {string} id - ID пользователя
 * @property {string} name - Имя пользователя
 * @property {string} surName - Фамилия пользователя
 * @property {string} fullName - Полное имя пользователя
 * @property {string} email - Email пользователя
 * @property {string} [telephone] - Телефон пользователя
 * @property {string} [employment] - Статус занятости пользователя
 * @property {boolean} [userAgreement] - Согласие с условиями
 */
export type User = {
  id: string;
  name: string;
  surName: string;
  fullName: string;
  email: string;
  telephone?: string;
  employment?: string;
  userAgreement?: boolean;
};

/**
 * Тип данных для редактирования пользователя
 * @typedef {Object} EditableUserFields
 * @property {string} name - Имя пользователя
 * @property {string} surName - Фамилия пользователя
 * @property {string} fullName - Полное имя пользователя
 * @property {string} [telephone] - Телефон пользователя
 * @property {string} [employment] - Статус занятости
 * @property {boolean} [userAgreement] - Согласие с условиями
 */
export type EditableUserFields = {
  name: string;
  surName: string;
  fullName: string;
  telephone?: string;
  employment?: string;
  userAgreement?: boolean;
};

type UsersState = {
  list: User[];
  loading: boolean;
  error: string | null;
};

const initialState: UsersState = {
  list: [],
  loading: false,
  error: null,
};

/**
 * Запрос на получение списка пользователей
 * @returns {Promise<User[]>} - Список пользователей
 */
export const fetchUsers = createAsyncThunk('users/fetch', async (_, thunkAPI) => {
  try {
    const response = await axios.get('/api/v1/users', { withCredentials: true });
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue('Ошибка загрузки пользователей');
  }
});

/**
 * Запрос на получение списка пользователей
 * @returns {Promise<User[]>} - Список пользователей
 */
export const fetchUserById = createAsyncThunk(
  'users/fetchById',
  async (id: string, thunkAPI) => {
    try {
      const response = await axios.get(`/api/v1/users/${id}`, { withCredentials: true });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue('Ошибка загрузки пользователя');
    }
  }
);

/**
 * Запрос на удаление пользователя
 * @param {string} id - ID пользователя
 * @returns {Promise<string>} - ID удалённого пользователя
 */
export const deleteUser = createAsyncThunk(
  'users/delete',
  async (id: string, thunkAPI) => {
    try {
      await axios.delete(`/api/v1/users/${id}`, { withCredentials: true });
      return id; // Возвращаем id для удаления пользователя из состояния
    } catch (err: any) {
      const errorMessage = (err.response?.data?.message || err.message || 'Ошибка при удалении');
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

/**
 * Запрос на обновление данных пользователя
 * @param {string} id - ID пользователя
 * @param {EditableUserFields} data - Данные для обновления пользователя
 * @returns {Promise<string>} - ID обновлённого пользователя
 */
export const updateUser = createAsyncThunk(
  'users/update',
  async ({ id, data }: { id: string; data: EditableUserFields }, thunkAPI) => {
    try {
      const { name, surName, fullName, telephone, employment, userAgreement } = data;
      const payload = {
        name: name.trim(),
        surName: surName.trim(),
        fullName: fullName.trim(),
        telephone: telephone?.trim() || '',
        employment,
        userAgreement: userAgreement ?? false,
      };

      await axios.patch(`/api/v1/users/${id}`, payload, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });

      return id;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Ошибка при сохранении';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.list = state.list.filter(user => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        const fetchedUser = action.payload;
        const index = state.list.findIndex((u) => u.id === fetchedUser.id);
        if (index !== -1) {
          state.list[index] = fetchedUser;
        } else {
          state.list.push(fetchedUser);
        }
      });
  },
});

export default usersSlice.reducer;
