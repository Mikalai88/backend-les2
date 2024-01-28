import {Request, Response, Router} from "express";
import {HTTP_STATUS} from "../enums/enum-HTTP";
import {JwtService} from "../application/jwt-service";
import {DeviceRepository} from "../repositories/device-repository";
import {DevicesService} from "../domain/devices-service";

export const securityDevicesRouter = Router({});

securityDevicesRouter.get('/', async (req: Request, res: Response) => {
    const tokenDecode = await JwtService.decodeToken(req.cookies.refreshToken)
    if (!tokenDecode) {
        return res.sendStatus(HTTP_STATUS.Unauthorized)
    }
    const devicesCurrentUser = await DeviceRepository.getAllDevicesCurrentUser(tokenDecode.userId)
    console.log("devicesCurrentUser", devicesCurrentUser)
    return res.status(HTTP_STATUS.OK).send(devicesCurrentUser)
})

securityDevicesRouter.delete('/', async (req: Request, res: Response) => {
    const tokenDecode = await JwtService.decodeToken(req.cookies.refreshToken)
    if (!tokenDecode) {
        return res.sendStatus(HTTP_STATUS.Unauthorized)
    }
    const findCurrentDevices = await DevicesService.terminateAllOtherSessions(tokenDecode.userId, tokenDecode.deviceId)
    if(!findCurrentDevices) {
        return res.sendStatus(HTTP_STATUS.Unauthorized)
    }
    return res.sendStatus(HTTP_STATUS.No_content)

})

securityDevicesRouter.delete('/:id',async (req: Request, res: Response) => {
    const tokenDecode = await JwtService.decodeToken(req.cookies.refreshToken)
    if(!tokenDecode) {
        return res.sendStatus(HTTP_STATUS.Unauthorized)
    }

    if (!req.params.id) {
        return res.sendStatus(HTTP_STATUS.Not_found)
    }

    const resultTerminate = await DevicesService.terminateThisSession(req.params.id, tokenDecode.userId)

    if(resultTerminate.error === "Forbidden") {
        return res.sendStatus(HTTP_STATUS.Forbidden)
    }
    if(!resultTerminate.success) {
        return res.sendStatus(HTTP_STATUS.Not_found)
    }
    return res.sendStatus(HTTP_STATUS.No_content)
})