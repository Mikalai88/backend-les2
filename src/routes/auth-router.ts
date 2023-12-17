import {Request, Response, Router} from "express";
import {usersService} from "../domain/user-service";
import {userValidation} from "../validators/user-validator";

export const authRouter = Router({})

authRouter.post('/login', userValidation(), async (req: Request, res: Response) => {
    const result = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (!result) {
        res.sendStatus(401)
        return
    }
    res.sendStatus(204)
})