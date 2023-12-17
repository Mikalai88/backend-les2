import {body} from "express-validator";
import {inputModelValidation} from "../middlewares/inputModel/input-model-validation";

const loginOrEmailValidation = body('loginOrEmail')
    .isString()
    .trim()
    .withMessage('Incorrect loginOrEmail!')

const loginValidation = body('login')
    .isString()
    .trim()
    .isLength({min: 3, max: 10})
    .withMessage('Incorrect login!')

const emailValidation = body('email')
    .isString()
    .trim()
    .isEmail()
    .withMessage('Incorrect email!')

const passwordValidation = body('password')
    .isString()
    .trim()
    .isLength({min: 6, max: 20})
    .withMessage('Incorrect password!')

export const userValidation = () => [loginOrEmailValidation, passwordValidation, inputModelValidation]

export const userCreateValidator = () => [loginValidation, emailValidation, passwordValidation, inputModelValidation]
