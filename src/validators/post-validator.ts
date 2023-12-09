import {body} from "express-validator";
import {BlogRepository} from "../repositories/blog-repository";
import {inputModelValidation} from "../middlewares/inputModel/input-model-validation";
import {blogCollection} from "../db/db";
import {ObjectId} from "mongodb";

const titleValidation = body("title")
    .isString()
    .trim()
    .isLength({min: 1, max: 30})
    .withMessage('Incorrect title.')

const shortDescriptionValidation = body("shortDescription")
    .isString()
    .trim()
    .isLength({min: 1, max: 100})
    .withMessage('Incorrect shortDescription.')

const contentValidation = body("content")
    .isString()
    .trim()
    .isLength({min: 1, max: 1000})
    .withMessage('Incorrect content.')

const blogIdValidation = body('blogId')
    .isString()
    .trim()
    .custom(async blogId => {
        if (ObjectId.isValid(blogId)) {
            const isFind = await blogCollection.findOne({_id: blogId})
            if (!isFind) {
                throw new Error('Invalid BlogId')
            }
        }
    })
    .withMessage("Incorrect blogId")

export const postValidation = () => [titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, inputModelValidation]