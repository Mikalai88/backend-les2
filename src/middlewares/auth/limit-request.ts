import {NextFunction, Request, Response} from "express";
import {RequestCounter} from "../../classes/request-counter-class";
import {HTTP_STATUS} from "../../enums/enum-HTTP";
import {RequestCountsModel} from "../../db/db";

export const limitRequestMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.ip) {
        return next()
    }
    const reqData: RequestCounter = new RequestCounter(req.ip, req.originalUrl, req.method)

    await RequestCountsModel.insertOne(reqData)

    const tenSecondsAgo = new Date(Date.now() - 10000)
    const filter = {$and: [{ip: reqData.ip}, {URL: reqData.URL}, {createdAt: {$gte: tenSecondsAgo}}, {method: reqData.method}]}

    const count = await RequestCountsModel.countDocuments(filter)
    if (count > 5) {
        return res.sendStatus(HTTP_STATUS.Too_Many_Requests)
    } else {
        return next()
    }
}
