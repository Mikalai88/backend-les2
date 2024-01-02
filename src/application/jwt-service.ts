import jwt, {JwtPayload} from 'jsonwebtoken';
import {settings} from "../settings";
import {UserType} from "../types/user/output";


export class JwtService {
    static async createAccessToken(user: UserType) {
        return jwt.sign({userID: user.id}, settings.JWT_SECRET, {expiresIn: '10s'})
    }

    static async createRefreshToken(deviceId: string, userId: string) {
        return jwt.sign({deviceId: deviceId, userId: userId}, settings.JWT_SECRET, {expiresIn: '20s'})

    }

    static async verifyJWT(token: string): Promise<string | null> {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return result.userID
        } catch (e) {
            return null
        }

    }

    static async decodeToken(token: string) {
        try {
            return jwt.verify(token, settings.JWT_SECRET) as JwtPayload
        } catch (e) {
            return null
        }

    }
}


