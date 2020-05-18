const { Router } = require("express");
const router = Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const passport = require("passport");

const User = require("../models/user");

router.post(
  "/register",
  [
    check("email", "Некорректный email").isEmail(),
    check("password", "Минимальная длинна пароля 6 символов").isLength({
      min: 6,
    }),
    check("repeatPassword", "Пароли должны совпадать").custom(
      (value, { req }) => value === req.body.password
    ),
  ],
  async (req, res) => {
    console.log(req.body);
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "некорректные данные при регистрации",
        });
      }
      const { name, login, email, password, repeatPassword } = req.body;

      if (password !== repeatPassword) {
        return res.status(400).json({
          errors: errors.array(),
          message: "пароли не совпадают",
        });
      }

      const candidate = await User.findOne({ login });

      if (candidate) {
        return res
          .status(400)
          .json({ message: "такой пользователь уже существует!" });
      }

      const hashPassword = await bcrypt.hash(password, 12);

      const user = new User({ name, login, email, password: hashPassword });

      await user.save();

      return res.status(201).json({ message: "пользователь создан!", user });
    } catch (error) {
      res
        .status(500)
        .json({ message: "что-то пошло не так! попробуйте снова." });
    }
  }
);
router.post(
  "/login",
  [
    check("login", "введите корректный login").exists(),
    check("password", "введите пароль").exists(),
  ],
  async (req, res) => {
    console.log(req.body);
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "некорректные данные при входе в аккаунт",
        });
      }

      const { login, password } = req.body;
      const user = await User.findOne({ login });
      console.log(user.id);

      if (!user) {
        return res.status(400).json({ message: "пользователь не найден" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "неверный пароль! попробуйте снова." });
      }

      const token = jwt.sign(
        { login: user.login, userId: user.id },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      return res
        .status(200)
        .json({ token: `bearer ${token}`, userId: user.id });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "что-то пошло не так! попробуйте снова." });
    }
  }
);

router.get(
  "/get_something",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    return res.status(200).json({ 1: 1, 2: 2, 3: 3 });
  }
);
module.exports = router;
