import {Router, Response, Request} from "express";
import {
    blogCollection,
    commentCollection, DevicesModel,
    postCollection,
    RequestCountsModel, tokenCollection,
    userCollection,
    videoCollection
} from "../db/db";

export const testingRoute = Router({})

testingRoute.delete('/all-data', async (req: Request, res: Response) => {
    await blogCollection.deleteMany({})
    await postCollection.deleteMany({})
    await userCollection.deleteMany({})
    await commentCollection.deleteMany({})
    await tokenCollection.deleteMany({})
    await RequestCountsModel.deleteMany({})
    await DevicesModel.deleteMany({})

    res.sendStatus(204)
})