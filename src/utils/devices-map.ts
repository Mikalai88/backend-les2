import {format} from "date-fns-tz";
import {fromUnixTime} from "date-fns";
import {DevicesDbModel} from "../types/devices-db-model";



export const devicesMap = (device: DevicesDbModel) => {
    const unixTime = fromUnixTime(device.issuedAt)
    const activeDate = format(new Date(unixTime), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSXXX', {timeZone: 'UTC'})
    return  {
        ip: device.ip,
        deviceId: device.deviceId,
        title: device.title,
        lastActiveDate: activeDate
    }
}