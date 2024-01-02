import {DevicesModel} from "../db/db";

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

    static async tokenDecay(deviceId: string) {
        const decayResult = await DevicesModel.deleteOne({deviceId: deviceId})
        return decayResult.deletedCount === 1
    }
}