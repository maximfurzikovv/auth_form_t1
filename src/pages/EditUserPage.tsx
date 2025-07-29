import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Container, Paper, Typography, TextField, MenuItem, Button, Box
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { fetchUserById, updateUser } from '../features/users/usersSlice';
import styles from './EditUserPage.module.css';
import type { EditableUserFields } from '../features/users/usersSlice';

/**
 * Тип данных формы для редактирования пользователя.
 * @typedef {Object} FormData
 * @property {string} name - Имя пользователя
 * @property {string} surName - Фамилия пользователя
 * @property {string} fullName - Полное имя пользователя
 * @property {string} [telephone] - Телефон пользователя
 * @property {string} [employment] - Статус занятости пользователя
 * @property {boolean} [userAgreement] - Согласие с условиями
 */
export type FormData = {
  name: string;
  surName: string;
  fullName: string;
  telephone?: string;
  employment?: string;
  userAgreement?: boolean;
};

export default function EditUserPage() {
  const { id } = useParams();
  const userId = id!;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, control, formState: { errors }, setValue } = useForm<FormData>({
    defaultValues: {
      name: '',
      surName: '',
      fullName: '',
      telephone: '',
      employment: '',
      userAgreement: false,
    }
  });
  // Данные пользователя из состояния
  const user = useAppSelector((state) =>
    state.users.list.find((u) => u.id === userId)
  );

  useEffect(() => {
    // Данные пользователя по ID
    dispatch(fetchUserById(userId));
  }, [dispatch, userId]);

  /**
   * Заполняем форму значениями из полученного пользователя.
   * @param {object} user - Данные пользователя.
   * @param {function} setValue - Функция для установки значений в форму.
   */
  useEffect(() => {
    if (user) {
      setValue('name', user.name || '');
      setValue('surName', user.surName || '');
      setValue('fullName', user.fullName || '');
      setValue('telephone', user.telephone || '');
      setValue('employment', user.employment || '');
      setValue('userAgreement', user.userAgreement ?? false);
    }
  }, [user, setValue]);

  /**
   * Обработчик отправки формы.
   * Отправляет данные на сервер для обновления пользователя.
   * @param {FormData} data - Данные формы для обновления.
   */
  const onSubmit = (data: FormData) => {
    const payload: EditableUserFields = {
      name: data.name.trim(),
      surName: data.surName.trim(),
      fullName: data.fullName.trim(),
      telephone: data.telephone?.trim() || '',
      employment: data.employment || '',
      userAgreement: data.userAgreement ?? false,
    };

    dispatch(updateUser({ id: userId, data: payload }))
      .unwrap()
      .then(() => navigate('/home'))
      .catch(() => alert('Ошибка при обновлении'));
  };

  return (
    <Container className={styles.container}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" className={styles.title}>
          Редактирование пользователя
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Имя"
            className={styles.textField}
            {...register("name", { required: true })}
            error={!!errors.name}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Фамилия"
            className={styles.textField}
            {...register("surName", { required: true })}
            error={!!errors.surName}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Полное имя"
            className={styles.textField}
            {...register("fullName", { required: true })}
            error={!!errors.fullName}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Телефон"
            className={styles.textField}
            {...register("telephone")}
            InputLabelProps={{ shrink: true }}
          />
          <Controller
            name="employment"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label="Занятость"
                className={styles.textField}
                {...field}
              >
                <MenuItem value="">Не выбрано</MenuItem>
                <MenuItem value="работаю">Работаю</MenuItem>
                <MenuItem value="студент">Студент</MenuItem>
                <MenuItem value="безработный">Безработный</MenuItem>
              </TextField>
            )}
          />
          <Box mt={2}>
            <Button type="submit" variant="contained" fullWidth>
              Сохранить
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
