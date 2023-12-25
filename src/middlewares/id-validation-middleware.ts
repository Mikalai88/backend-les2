import {Request, Response, NextFunction} from "express";
import {ObjectId} from "mongodb";

export const idValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if(!ObjectId.isValid(req.params.id))  {
        return res.sendStatus(404)
    } else {
        return next()
    }
}

