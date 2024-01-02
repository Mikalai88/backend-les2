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
        const decodeToken: JwtPayload | null = await JwtService.decodeToken(token)
        if (!decodeToken) {
            return resultCodeMap(false, null, "Unauthorized")
        }
        const device: DevicesDbModel | null = await DeviceRepository.findDeviceByDeviceId(decodeToken.deviceId)
        if (!device) {
            return resultCodeMap(false, null, "Unauthorized")
        }
        const user = await userCollection.findOne({id: device.userId})
        if (!user) {
            return resultCodeMap(false, null, "Unauthorized")
        }
        if (decodeToken.iat !== device.issuedAt) {
            return resultCodeMap(false, null, "Unauthorized")
        }
        if (isBefore(Date.now(), decodeToken.exp!)) {
            return resultCodeMap(false, null, "Unauthorized")
        }
        const newAccessToken = await JwtService.createAccessToken(user)
        const newRefreshToken = await JwtService.createRefreshToken(device.deviceId, user.id!.toString())
        const decodeNewToken = await JwtService.decodeToken(newRefreshToken)
        const updateDateToken = {
            issuedAt: decodeNewToken!.iat,
            expiresAt: decodeNewToken!.exp
        }

        const updateResult = await DeviceRepository.updateTokenInfo(updateDateToken, device.deviceId)
        if (!updateResult) {
            return resultCodeMap(false, null, "Error_Server")
        }
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
        const logoutDevice = await DeviceRepository.tokenDecay(decodeToken.deviceId)
        if(!logoutDevice) {
            return resultCodeMap(false, null, "Error_Server")
        }
        return resultCodeMap(true, null)
    }

}