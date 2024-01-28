import {blogCollection, DevicesModel, tokenCollection} from "../db/db";
import {OutputItemsBlogType} from "../types/blog/output";
import {JwtPayload} from "jsonwebtoken";
import {devicesMap} from "../utils/devices-map";

export class DeviceRepository {
    static async findDeviceByDeviceId(deviceId: string) {
        return  DevicesModel.findOne({deviceId: deviceId})
    }

    static async updateTokenInfo(updateDateToken: object, deviceId: string) {
        return DevicesModel.updateOne({deviceId: deviceId}, {$set: updateDateToken})
    }

    static async findDeviceByUserId(userId: string) {
        return DevicesModel.findOne({userId: userId})
    }

    static async getAllDevicesCurrentUser(userId: string) {
        const deviceArray = await DevicesModel.find({userId: userId})
        return deviceArray.map(devicesMap)
    }

    static async terminateSessions(deviceId: string) {
        const resultDelete = await DevicesModel.deleteOne({deviceId: deviceId})
        return resultDelete.deletedCount === 1
    }

    async findDeviceByUserId(userId: string) {
        return DevicesModel.findOne({userId: userId})
    }

    static async tokenDecay(decodeToken: JwtPayload) {
        try {
            const result = await tokenCollection.insertOne(decodeToken)
            return result.acknowledged
        } catch (error) {
            console.log(error)
            return null
        }

    }
}