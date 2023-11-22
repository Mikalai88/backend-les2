import express, {Request, Response} from "express";
import {videoRoute} from "./routes/video-route";
import {blogRoute} from "./routes/blog-route";
import {postRoute} from "./routes/post-route";
import {testingRoute} from "./routes/testing-route";

export const app = express()

app.use(express.json())

app.use('/testing/all-data', testingRoute)
app.use('/videos', videoRoute)
app.use('/blogs', blogRoute)
app.use('/posts', postRoute)

export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    BAD_REQUEST_400: 400,
    UNAUTHORIZED_401: 401,
    NOT_FOUND_404: 404
}


