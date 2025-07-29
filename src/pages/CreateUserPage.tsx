import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Container, Paper, Typography, TextField, MenuItem, Checkbox,
  FormControlLabel, Button, Box
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./CreateUserPage.module.css";

type FormData = {
  name: string;
  surName: string;
  fullName: string;
  password: string;
  email: string;
  telephone?: string;
  employment?: string;
  userAgreement: boolean;
};

export default function CreateUserPage() {
  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<FormData>();
  const navigate = useNavigate();

  const name = watch('name');
  const surName = watch('surName');

  // Значение fullName при изменении name или surName
  useEffect(() => {
    setValue('fullName', `${name || ''} ${surName || ''}`.trim());
  }, [name, surName, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      await axios.post('/api/v1/users', data, { withCredentials: true });
      navigate('/home');
    } catch {
      alert("Ошибка при создании пользователя");
    }
  };

  return (
    <Container className={styles.container}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" className={styles.title}>
          Создание пользователя
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Имя"
            className={styles.textField}
            {...register("name", { required: "Обязательное поле", maxLength: 64 })}
            error={!!errors.name}
            helperText={errors.name?.message}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Фамилия"
            className={styles.textField}
            {...register("surName", { required: "Обязательное поле", maxLength: 64 })}
            error={!!errors.surName}
            helperText={errors.surName?.message}
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
            label="Пароль"
            type="password"
            className={styles.textField}
            {...register("password", { required: "Обязательное поле" })}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Email"
            className={styles.textField}
            {...register("email", {
              required: "Email обязателен",
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: "Некорректный email"
              }
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Телефон"
            className={styles.textField}
            {...register("telephone", {
              pattern: {
                value: /^\+7\d{10}$/,
                message: "Формат: +79991231231"
              }
            })}
            error={!!errors.telephone}
            helperText={errors.telephone?.message}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Занятость"
            select
            className={styles.textField}
            {...register("employment")}
            InputLabelProps={{ shrink: true }}
          >
            <MenuItem value="работаю">Работаю</MenuItem>
            <MenuItem value="студент">Студент</MenuItem>
            <MenuItem value="безработный">Безработный</MenuItem>
          </TextField>

          <FormControlLabel
            control={
              <Controller
                name="userAgreement"
                control={control}
                rules={{ required: "Обязательное поле" }}
                render={({ field }) => <Checkbox {...field} />}
              />
            }
            label="Согласен с условиями"
          />
          {errors.userAgreement && (
            <Typography color="error" variant="caption">
              {errors.userAgreement.message}
            </Typography>
          )}

          <Box mt={2}>
            <Button type="submit" variant="contained" fullWidth>
              Создать
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
