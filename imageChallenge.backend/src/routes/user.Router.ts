import express from 'express';
import { CustomValidator } from 'express-validator';
import { User } from '../models/user.Model';
const { body } = require('express-validator');
const userController = require("../controllers/user.controller");

export const userRouter = express.Router();


const isValidUserName: CustomValidator = value => {
    return User.findOne({username:value}).then(user => {
      if (user) {
        return Promise.reject('username already in use !');
      }
    });
  };




userRouter.post('/login',userController.login);

userRouter.post('/signup', body('username').custom(isValidUserName), userController.saveUser);

