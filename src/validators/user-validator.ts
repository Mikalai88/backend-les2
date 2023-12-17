import {body} from "express-validator";
import {inputModelValidation} from "../middlewares/inputModel/input-model-validation";

const loginOrEmailValidation = body('loginOrEmail')
    .isString()
    .trim()
    .withMessage('Incorrect login!')

const passwordValidation = body('password')
    .isString()
    .trim()
    .withMessage('Incorrect password!')

export const userValidation = () => [loginOrEmailValidation, passwordValidation, inputModelValidation]
