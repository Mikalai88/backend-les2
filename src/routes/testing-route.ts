import {Router, Response, Request} from "express";
import {HTTP_STATUSES} from "../settings";
import {db} from "../db/db";

export const testingRoute = Router({})

testingRoute.delete('/all-data', (req: Request, res: Response) => {
    db.blogs.length = 0
    db.posts.length = 0
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})