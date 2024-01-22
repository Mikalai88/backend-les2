import {ResultCodeHandler, resultCodeMap} from "./comment-service";
import {JwtPayload} from "jsonwebtoken";
import {Errors} from "../enums/errors";
import {TokensModel} from "../types/jwt-access-model";
import {isBefore} from "date-fns";
import {JwtService} from "../application/jwt-service";
import {DevicesDbModel} from "../types/devices-db-model";
import {DeviceRepository} from "../repositories/device-repository";
import {userCollection} from "../db/db";

export class DevicesService {
    static async updateRefreshToken(token: string): Promise<ResultCodeHandler<TokensModel>> {
        const userId: string | null = await JwtService.verifyJWT(token)
        if (!userId) {
            return resultCodeMap(false, null, "Unauthorized")
        }
        const user = await userCollection.findOne({id: userId})
        if (!user) {
            return resultCodeMap(false, null, "Unauthorized")
        }
        const newAccessToken = await JwtService.createAccessToken(user)
        const newRefreshToken = await JwtService.createRefreshToken(user.id)

        const newTokens = {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        }

        return resultCodeMap(true, newTokens)
    }

    static async logoutUser(token: string) {
        const decodeToken = await JwtService.decodeToken(token)
        if(!decodeToken) {
            return resultCodeMap(false, null, "Unauthorized")
        }
        const user = await DeviceRepository.findDeviceByUserId(decodeToken.userId)
        if(!user) {
            return resultCodeMap(false, null, "Unauthorized")
        }
        const logoutDevice = await DeviceRepository.tokenDecay(decodeToken) // записывает в БД токен
        if(!logoutDevice) {
            return resultCodeMap(false, null, "Error_Server")
        }
        return resultCodeMap(true, null)
    }

}