import {body} from "express-validator";
import {inputModelValidation} from "../middlewares/inputModel/input-model-validation";

const commentsValidationRule = body('content')
    .isString().withMessage('Not a string.')
    .trim()
    .notEmpty().withMessage('Empty.')
    .isLength({min: 20 , max: 300}).withMessage('Invalid length.')

export const commentsValidationMiddleware = [commentsValidationRule, inputModelValidation]
