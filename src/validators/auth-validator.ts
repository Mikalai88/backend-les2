import {body} from "express-validator";
import {userCollection} from "../db/db";
import {inputModelValidation} from "../middlewares/inputModel/input-model-validation";

export enum ERRORS_MESSAGE {
    NOT_EMPTY = 'input must by not empty',
    IS_STRING = 'input must by string',
    IS_LENGTH = 'input length incorrect',
    PATTERN_INCORRECT = 'unacceptable symbols',
    SPACES_FIELD = 'field cannot be all spaces',
    NOT_FOUND = 'is not found',
    FOUND = 'this user exist'
}

const registrationUserEmailValidationRule = body('email')
    .isString().withMessage(ERRORS_MESSAGE.IS_STRING)
    .trim()
    .notEmpty().withMessage(ERRORS_MESSAGE.NOT_EMPTY)
    .isLength({min: 6, max: 30}).withMessage(ERRORS_MESSAGE.IS_LENGTH)
    .isEmail().withMessage(ERRORS_MESSAGE.PATTERN_INCORRECT)
    .custom(async email => {
        const user = await userCollection.findOne({'emailConfirmation.userEmail': email})
        if(user) {
            throw new Error(ERRORS_MESSAGE.FOUND)
        }
    })

const registrationUserLoginValidationRule = body('login')
    .isString().withMessage(ERRORS_MESSAGE.IS_STRING)
    .trim()
    .notEmpty().withMessage(ERRORS_MESSAGE.NOT_EMPTY)
    .isLength({min: 3, max: 10}).withMessage(ERRORS_MESSAGE.IS_LENGTH)
    .matches('^[a-zA-Z0-9_-]*$').withMessage(ERRORS_MESSAGE.PATTERN_INCORRECT)
    .custom(async login => {
        const user = await userCollection.findOne({userLogin: login})
        if(user) {
            throw new Error(ERRORS_MESSAGE.FOUND)
        }
    } )


const passwordValidationRule = body('password' || 'newPassword')
    .isString().withMessage(ERRORS_MESSAGE.IS_STRING)
    .trim()
    .notEmpty().withMessage(ERRORS_MESSAGE.NOT_EMPTY)
    .isLength({min: 6, max: 20}).withMessage(ERRORS_MESSAGE.IS_LENGTH)

const codeValidationRule = body('code')
    .isString().withMessage(ERRORS_MESSAGE.IS_STRING)
    .trim()
    .notEmpty().withMessage(ERRORS_MESSAGE.NOT_EMPTY)

const emailValidationRule = body('email')
    .isString().withMessage(ERRORS_MESSAGE.IS_STRING)
    .trim()
    .notEmpty().withMessage(ERRORS_MESSAGE.NOT_EMPTY)
    .isLength({min: 6, max: 30}).withMessage(ERRORS_MESSAGE.IS_LENGTH)
    .isEmail().withMessage(ERRORS_MESSAGE.PATTERN_INCORRECT)

export const emailValidationMiddleware = () => [emailValidationRule, inputModelValidation]
export const codeValidationMiddleware = () => [codeValidationRule, inputModelValidation]

export const userRegistrationValidation = () => [registrationUserEmailValidationRule, registrationUserLoginValidationRule, passwordValidationRule, inputModelValidation]
