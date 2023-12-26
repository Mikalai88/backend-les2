import {Request, Response, Router} from "express";
import {usersService} from "../domain/user-service";
import {userValidation} from "../validators/user-validator";
import {JwtService} from "../application/jwt-service";
import {OutputItemsUserType} from "../types/user/output";
import {UserRepository} from "../repositories/user-repository";
import {mapAuthUser} from "../utils/map-me-user";
import {authJWTMiddleware} from "../middlewares/auth/auth-middleware";
import {
    codeValidationMiddleware,
    emailValidationMiddleware,
    userRegistrationValidation
} from "../validators/auth-validator";
import {RequestWithBody} from "../types/common";
import {CodeConfirmModel, UserInputModel} from "../types/user/input";
import {HTTP_STATUS} from "../enums/enum-HTTP";
import {limitRequestMiddleware} from "../middlewares/auth/limit-request";
import {EmailResending} from "../types/email";
import {CodeIncorrectMessage, CodeConfirmed, EmailNotFound, ExpiredCodeMessage} from "../enums/errors-messages";
import {body} from "express-validator";

export const authRouter = Router({})

authRouter.post('/login', userValidation(), async (req: Request, res: Response) => {
    const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (!user) {
        res.sendStatus(401)
        return
    }
    const token = await JwtService.createAccessToken(user)
    console.log("TOKEN", token)
    res.status(200).send({accessToken: token})
})

authRouter.post('/registration', limitRequestMiddleware, userRegistrationValidation(), async (req: RequestWithBody<UserInputModel>, res: Response) => {
    const resultRegistration = await usersService.createUser(req.body.login, req.body.email, req.body.password)

    if (!resultRegistration) {
        return res.status(HTTP_STATUS.Bad_request)
    }
    if (resultRegistration) {
        return res.sendStatus(HTTP_STATUS.No_content)
    }
    return res.sendStatus(HTTP_STATUS.Server_error)
})

authRouter.post('/registration-confirmation', limitRequestMiddleware, codeValidationMiddleware(), async (req: RequestWithBody<CodeConfirmModel>, res: Response) => {
    const isConfirm = await usersService.confirmUser(req.body)
    if (isConfirm.error === "Code_No_Valid") {
        return res.status(HTTP_STATUS.Bad_request).json(CodeIncorrectMessage)
    }
    if (isConfirm.error === "Expiration_Date") {
        return res.status(HTTP_STATUS.Bad_request).json(ExpiredCodeMessage)
    }
    if (isConfirm.error === "Is_Confirmed") {
        return res.status(HTTP_STATUS.Bad_request).json(CodeConfirmed)
    }
    return res.sendStatus(HTTP_STATUS.No_content)
})

authRouter.post('/registration-email-resending', emailValidationMiddleware(),
    async (req: Request, res: Response) => {
        console.log("REQ", req.body)
    const resendingResult = await usersService.emailResending(req.body)

    if (resendingResult.error === "Not_Found") {
        return res.status(HTTP_STATUS.Bad_request).send(EmailNotFound)
    }
    if (resendingResult.error === "Is_Confirmed") {
        return res.status(HTTP_STATUS.Bad_request).send(CodeConfirmed)
    }
    if (resendingResult.error === "Error_Server") {
        return res.status(HTTP_STATUS.Server_error)
    }
    return res.sendStatus(HTTP_STATUS.No_content)
})

authRouter.get('/me', authJWTMiddleware, async (req: Request, res: Response) => {
    const user: OutputItemsUserType | null = await UserRepository.findUserById(req.user!.id)
    if (!user) {
        return res.sendStatus(401)
    }
    return res.status(200).send(mapAuthUser(user))
})