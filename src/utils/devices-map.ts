import {format} from "date-fns-tz";
import {fromUnixTime} from "date-fns";
import {DevicesDbModel} from "../types/devices-db-model";



// export const devicesMap = (device: DevicesDbModel) => {
//     const unixTime = fromUnixTime(device.issuedAt)
//     const activeDate = format(new Date(unixTime), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSXXX', {timeZone: 'UTC'})
//     return  {
//         ip: device.ip,
//         deviceId: device.deviceId,
//         title: device.title,
//         lastActiveDate: activeDate
//     }
// }

export const devicesMap = (device: DevicesDbModel) => {
    const unixTime = new Date(device.issuedAt * 1000); // Преобразуем Unix timestamp в объект Date
    const activeDate = unixTime.toISOString(); // Преобразуем в строку в формате ISO

    return {
        ip: device.ip,
        deviceId: device.deviceId,
        title: device.title,
        lastActiveDate: activeDate // Возвращаем время в UTC
    }
}
