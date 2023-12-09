import {Router, Response, Request} from "express";
import {blogCollection, postCollection, videoCollection} from "../db/db";

export const testingRoute = Router({})

testingRoute.delete('/all-data', async (req: Request, res: Response) => {
    await blogCollection.deleteMany({})
    await postCollection.deleteMany({})
    await videoCollection.deleteMany({})

    res.sendStatus(204)
})