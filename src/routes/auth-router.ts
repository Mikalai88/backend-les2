import {Request, Response, Router} from "express";
import {usersService} from "../domain/user-service";
import {userValidation} from "../validators/user-validator";
import {JwtService} from "../application/jwt-service";
import {OutputItemsUserType, UserType} from "../types/user/output";
import {UserRepository} from "../repositories/user-repository";
import {mapAuthUser} from "../utils/map-me-user";
import {authJWTMiddleware} from "../middlewares/auth/auth-middleware";

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

authRouter.get('/me', authJWTMiddleware, async (req: Request, res: Response) => {
    const user: OutputItemsUserType | null = await UserRepository.findUserById(req.user!.id)
    if (!user) {
        return res.sendStatus(401)
    }
    return res.status(200).send(mapAuthUser(user))
})