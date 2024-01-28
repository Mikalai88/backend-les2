import {ResultCodeHandler, resultCodeMap} from "./comment-service";
import {JwtPayload} from "jsonwebtoken";
import {Errors} from "../enums/errors";
import {TokensModel} from "../types/jwt-access-model";
import {isBefore} from "date-fns";
import {JwtService} from "../application/jwt-service";
import {DevicesDbModel} from "../types/devices-db-model";
import {DeviceRepository} from "../repositories/device-repository";
import {tokenCollection, userCollection} from "../db/db";
import {IncomingHttpHeaders} from "http";
import {LoginInputModel} from "../types/login-input-model";
import {usersService} from "./user-service";
import {WithId} from "mongodb";
import {Devices} from "../classes/devices-class";
import {randomUUID} from "crypto";

export class DevicesService {
    static async updateRefreshToken(token: string): Promise<ResultCodeHandler<TokensModel>> {
        const decodeToken: JwtPayload | null = await JwtService.decodeToken(token)
        console.log("decodeToken", decodeToken)
        if (!decodeToken) {
            return resultCodeMap(false, null, "Unauthorized")
        }

        await tokenCollection.insertOne({token: token})

        const userId: string | null = await JwtService.verifyJWT(token)

        console.log("USER_ID", userId)

        if (!userId) {
            return resultCodeMap(false, null, "Unauthorized")
        }
        const device: DevicesDbModel | null = await DeviceRepository.findDeviceByDeviceId(decodeToken.deviceId)

        console.log("device", device)

        if (!device) {
            return resultCodeMap(false, null, "Unauthorized")
        }
        const user = await userCollection.findOne({id: userId})

        console.log("USER", user)

        if (!user) {
            return resultCodeMap(false, null, "Unauthorized")
        }
        const newAccessToken = await JwtService.createAccessToken(user)
        console.log("newAccessToken", newAccessToken)
        const newRefreshToken = await JwtService.createRefreshToken(device.deviceId, user.id)
        console.log("newRefreshToken", newRefreshToken)

        const newTokens = {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        }

        return resultCodeMap(true, newTokens)
    }

    static async terminateAllOtherSessions(userId: string, deviceId: string) {
        const cursor = await DeviceRepository.getAllDevicesCurrentUser(userId);
        if (!cursor) return false;

        const findSessions = await cursor;

        for (const session of findSessions) {
            if (session.deviceId !== deviceId) {
                await DeviceRepository.terminateSessions(session.deviceId);
            }
        }

        return true;
    }

    static async terminateThisSession(deviceId: string, userId: string) {
        const findSession = await DeviceRepository.findDeviceByDeviceId(deviceId)
        if(!findSession) {
            return resultCodeMap(false, null, "Not_Found")
        }
        if(findSession.userId !== userId) {
            return resultCodeMap(false, null, "Forbidden")
        }
        const resultDelete = await DeviceRepository.terminateSessions(deviceId)
        if(!resultDelete) {
            return resultCodeMap(false, null, "Error_Server")
        }
        return resultCodeMap(true, null)
    }
    static async loginDevice(loginOrEmail: string, password: string, header: IncomingHttpHeaders, ip: string): Promise<ResultCodeHandler<TokensModel>> {
        const user = await usersService.checkCredentials(loginOrEmail, password)
        if (!user) {
            return resultCodeMap(false, null, "Unauthorized")
        }

        const deviceId = randomUUID()
        const accessToken = await JwtService.createAccessToken(user)
        const refreshToken = await JwtService.createRefreshToken(deviceId, user.id)
        const tokenDecode = await JwtService.decodeToken(refreshToken)
        if (!tokenDecode) {
            return resultCodeMap(false, null, "Unauthorized")
        }

        const newDevice: DevicesDbModel = new Devices(
            deviceId,
            header["user-agent"],
            tokenDecode.iat!,
            tokenDecode.exp!,
            user.id,
            ip)

        console.log("newDevice", newDevice)

        const isSave = await DeviceRepository.saveLoginDevice(newDevice)

        console.log("isSave", isSave)

        if (!isSave) {
            return resultCodeMap(false, null, "Error_Server")
        }
        const tokens = {accessToken: accessToken, refreshToken: refreshToken}
        return resultCodeMap(true, tokens)
    }



    // static async terminateAllOtherSessions(userId: string, deviceId: string) {
    //     const findSessions = await DeviceRepository.getAllDevicesCurrentUser(userId)
    //     if (!findSessions) return false
    //
    //     for (const session of findSessions) {
    //         if (session.deviceId !== deviceId) await DeviceRepository.terminateSessions(session.deviceId)
    //     }
    //     return true
    // }
























    // static async logoutUser(token: string) {
    //     const decodeToken = await JwtService.decodeToken(token)
    //     if(!decodeToken) {
    //         return resultCodeMap(false, null, "Unauthorized")
    //     }
    //     const user = await DeviceRepository.findDeviceByUserId(decodeToken.userId)
    //     if(!user) {
    //         return resultCodeMap(false, null, "Unauthorized")
    //     }
    //     const logoutDevice = await DeviceRepository.tokenDecay(decodeToken) // записывает в БД токен
    //     if(!logoutDevice) {
    //         return resultCodeMap(false, null, "Error_Server")
    //     }
    //     return resultCodeMap(true, null)
    // }

}