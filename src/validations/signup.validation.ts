import { check } from "express-validator";

export default [
  check("email", "Некорректный email").isEmail(),
  check("password", "Минимальная длинна пароля 6 символов").isLength({
    min: 6,
  }),
  check("repeatPassword", "Пароли должны совпадать").custom(
    (value, { req }) => value === req.body.password
  ),
];
