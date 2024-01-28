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
import {CodeIncorrectMessage, CodeConfirmed, EmailNotFound, ExpiredCodeMessage} from "../enums/errors-messages";
import {DevicesService} from "../domain/devices-service";
import {tokenCollection} from "../db/db";
import { randomUUID } from 'crypto'
import {DevicesDbModel} from "../types/devices-db-model";
import {Devices} from "../classes/devices-class";
import {resultCodeMap} from "../domain/comment-service";

export const authRouter = Router({})

authRouter.post('/login', limitRequestMiddleware, userValidation(), async (req: Request, res: Response) => {
    const resultLogin = await DevicesService.loginDevice(req.body.loginOrEmail, req.body.password, req.headers, req.ip!)

    if (!resultLogin.data) {
        return res.sendStatus(HTTP_STATUS.Unauthorized)
    }
    return res
        .cookie('refreshToken', resultLogin.data.refreshToken, {httpOnly: true, secure: true})
        .status(HTTP_STATUS.OK).send({accessToken: resultLogin.data.accessToken})

    // const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
    // if (!user) {
    //     res.sendStatus(401)
    //     return
    // }
    //
    // const deviceId = randomUUID();
    // const token = await JwtService.createAccessToken(user)
    // const refreshToken = await JwtService.createRefreshToken(user.id!)
    // const tokenDecode = await JwtService.decodeToken(refreshToken)
    // if (!tokenDecode) {
    //     return resultCodeMap(false, null, "Unauthorized")
    // }
    //
    // const newDevice: DevicesDbModel = new Devices(
    //     tokenDecode.deviceId,
    //     header["user-agent"],
    //     tokenDecode.iat!,
    //     tokenDecode.exp!,
    //     user.id,
    //     ip)
    //
    // res
    //     .cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
    //     .status(200).send({accessToken: token})
})

authRouter.post('/logout', async (req: Request, res: Response) => {
    const tokenRefresh = req.cookies.refreshToken

    if (!tokenRefresh) {
        return res.sendStatus(HTTP_STATUS.Unauthorized)
    }

    const blackToken = await tokenCollection.findOne({ token: tokenRefresh });

    if (blackToken) {
        return res.sendStatus(HTTP_STATUS.Unauthorized)
    }

    await tokenCollection.insertOne({token: tokenRefresh})

    return res.sendStatus(HTTP_STATUS.No_content)
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

authRouter.post('/refresh-token', async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken

    if (!token) {
        return res.sendStatus(HTTP_STATUS.Unauthorized)
    }
    const blackToken = await tokenCollection.findOne({token: token})
    if (blackToken) {
        return res.sendStatus(HTTP_STATUS.Unauthorized)
    }

    const resultUpdateToken = await DevicesService.updateRefreshToken(token)

    if (!resultUpdateToken.success) {
        return res.sendStatus(HTTP_STATUS.Unauthorized)
    }
    return res
        .cookie('refreshToken', resultUpdateToken!.data!.refreshToken, {httpOnly: true, secure: true})
        .status(HTTP_STATUS.OK)
        .send({accessToken: resultUpdateToken!.data!.accessToken})
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

authRouter.post('/registration-email-resending', limitRequestMiddleware, emailValidationMiddleware(),
    async (req: Request, res: Response) => {
    const resendingResult = await usersService.emailResending(req.body)

    if (resendingResult.error === "Not_Found") {
        return res.status(HTTP_STATUS.Bad_request).send(EmailNotFound)
    }
    if (resendingResult.error === "Is_Confirmed") {
        return res.status(HTTP_STATUS.Bad_request).send(EmailNotFound)
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