import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../../settings";

const login = "admin"
const password = "qwerty"

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // if (req.headers['authorization'] !== "Basic YWRtaW46cXdlcnR5") {
    //     res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    //     return
    // }
    //
    // return next()

    // OR

    const auth = req.headers['authorization']

    if (!auth) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    const [basic, token] = auth.split(" ")

    if (basic !== "Basic") {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    const decodedData = Buffer.from(token, 'base64').toString()

    const [decodedLogin, decodedPassword] = decodedData.split(":")

    if (decodedLogin !== login || decodedPassword !== password) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    return next()
}