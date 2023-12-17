import {Router, Response, Request} from "express";
import {blogCollection, postCollection, userCollection, videoCollection} from "../db/db";

export const testingRoute = Router({})

testingRoute.delete('/all-data', async (req: Request, res: Response) => {
    await blogCollection.deleteMany({})
    await postCollection.deleteMany({})
    await userCollection.deleteMany({})

    res.sendStatus(204)
})