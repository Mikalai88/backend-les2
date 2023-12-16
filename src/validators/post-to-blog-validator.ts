import {body} from "express-validator";
import {BlogRepository} from "../repositories/blog-repository";
import {inputModelValidation} from "../middlewares/inputModel/input-model-validation";

// const idValidation = body("id")
//     .isString()
//     .trim()
//     .withMessage('Incorrect id.')
//
// const blogNameValidation = body("blogName")
//     .isString()
//     .trim()
//     .withMessage('Incorrect blogName.')

const createdAtValidation = body("createdAt")
    .isString()
    .trim()
    .matches(/\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d\\.\\d+([+-][0-2]\\d:[0-5]\\d|Z)/)
    .withMessage('Incorrect createdAt.')

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

// const blogIdValidation = body('blogId')
//     .isString()
//     .trim()
//     .custom(async (value) => {
//         const blog = await BlogRepository.getBlogById(value)
//         if (!blog) {
//             throw new Error("Incorrect blogId.")
//         }
//         return true
//     })
//     .withMessage("Incorrect blogId.")

export const postToBlogValidation = () => [
    // idValidation,
    // blogNameValidation,
    // createdAtValidation,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    // blogIdValidation,
    inputModelValidation]