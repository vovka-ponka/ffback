import { body } from 'express-validator';

export const registerValidation = [
  body('email', 'Не вірний формат пошти').isEmail(),
  body('password', 'Мінімальний пароль повинен бути із 4 символів').isLength({ min: 4 }),
  body('name', "Вкажіть своє ім'я").isLength({ min: 2 }),
  body('avatarUrl', 'Не вірна ссилка на аватарку').optional().isURL(),
];

export const loginValidation = [
  body('email', 'Не вірний формат пошти').isEmail(),
  body('password', 'Мінімальний пароль повинен бути із 4 символів').isLength({ min: 4 }),
];
