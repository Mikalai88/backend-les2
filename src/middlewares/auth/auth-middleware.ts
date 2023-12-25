import {NextFunction, Request, Response} from "express";
import {usersService} from "../../domain/user-service";
import {JwtService} from "../../application/jwt-service";
import {userCollection} from "../../db/db";

const login = "admin"
const password = "qwerty"

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    console.log("HEADERS", req.headers['authorization'])

    if (req.headers['authorization'] !== "Basic YWRtaW46cXdlcnR5") {
        res.sendStatus(401)
        return
    }

    // const token = req.headers.authorization.split('')[1]
    //
    // const userId = await JwtService.verifyJWT(token)
    //
    // console.log("USER ID", userId)
    //
    // if (userId) {
    //     req.user = await usersService.findUserById(userId)
    //     next()
    // }

    next()
}

export const authJWTMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        return res.sendStatus(401)
    }
    const token = req.headers.authorization.split('')[1]

    const userId = await JwtService.verifyJWT(token)

    if (userId) {
        req.user = await usersService.findUserById(userId)
        next()
    }

    return res.sendStatus(401)
}

export const checkAuthUser = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        req.user = null
        return next()
    }

    const token = req.headers.authorization.split(" ")[1]

    const userId = await JwtService.verifyJWT(token)
    if (!userId) {
        return res.sendStatus(401)
    }
    req.user = await usersService.findUserById(userId)
    next()
}




// OR

// const auth = req.headers['authorization']
//
// if (!auth) {
//     res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
//     return
// }
//
// const [basic, token] = auth.split(" ")
//
// if (basic !== "Basic") {
//     res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
//     return
// }
//
// const decodedData = Buffer.from(token, 'base64').toString()
//
// const [decodedLogin, decodedPassword] = decodedData.split(":")
//
// if (decodedLogin !== login || decodedPassword !== password) {
//     res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
//     return
// }
//
// return next()