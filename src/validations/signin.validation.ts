import { check } from "express-validator";

export default [
  check("login", "введите корректный login").exists(),
  check("password", "введите пароль").exists(),
];
