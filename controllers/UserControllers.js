import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';

//Рєєстраця користувача
export const register = async (req, res) => {
  try {
    // Шифрування паролю
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    // Створення користувача
    const doc = new UserModel({
      name: req.body.name,
      email: req.body.email,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    // Збереження користувача в БД
    const user = await doc.save();
    // Створення токена та його шифрування(ай-ді користувача) за допомогою бібліотеки jwt
    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      },
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      massage: 'Ви не змогли зареєструватися',
    });
  }
};

//Вхід користувача
export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      email: req.body.email,
    });
    if (!user) {
      return res.status(404).json({
        message: 'Користувача не знайдено',
      });
    }

    const isValuePass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

    if (!isValuePass) {
      return res.status(400).json({
        message: 'Не вірний логін або пароль',
      });
    }
    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      },
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      massage: 'Не вдається авторизуватися',
    });
  }
};
//Перевірка користувача
export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        massage: 'Користувача не знайдено',
      });
    }
    const { passwordHash, ...userData } = user._doc;

    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      massage: 'Немає доступу',
    });
  }
};
