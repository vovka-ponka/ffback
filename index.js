import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import * as UserControllers from './controllers/UserControllers.js';

import { registerValidation, loginValidation } from './validation/validationUser.js';

import handleValidationEr from './validation/handleValidationEr.js';
import checkAuth from './utils/CheckAuth.js';

const app = express();

app.use(express.json());
app.use(cors());

mongoose
  // .connect('mongodb+srv://admin:admin@cluster0.g2jmnkp.mongodb.net/football')
  .connect('process.env.MONGODB_URI')
  .then(() => console.log('DB OK'))
  .catch(() => console.log('DB error', err));

app.post('/register', registerValidation, handleValidationEr, UserControllers.register);
app.post('/login', loginValidation, handleValidationEr, UserControllers.login);
app.get('/me', checkAuth, UserControllers.getMe);

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }
  return console.log('Server OK');
});
