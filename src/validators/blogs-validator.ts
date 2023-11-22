import {body} from "express-validator";
import {inputModelValidation} from "../middlewares/inputModel/input-model-validation";
import {BlogRepository} from "../repositories/blog-repository";

const nameValidation = body('name')
    .isString()
    .trim()
    .isLength({min: 1, max: 15})
    .withMessage('Incorrect name!')

const descriptionValidation = body('description')
    .isString()
    .trim()
    .isLength({min: 1, max: 500})
    .withMessage('Incorrect description!')

const websiteUrlValidation = body('websiteUrl')
    .isString()
    .trim()
    .isLength({min: 1, max: 100})
    .matches('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$\n')
    .withMessage('Incorrect websiteUrl!')

export const blogValidation = () => [nameValidation, descriptionValidation, websiteUrlValidation, inputModelValidation]

