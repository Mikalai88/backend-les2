import express, {Request, Response} from "express";
// import {videoRoute} from "./routes/video-route";
import {blogRoute} from "./routes/blog-route";
import {postRoute} from "./routes/post-route";
import {testingRoute} from "./routes/testing-route";
import {userRoute} from "./routes/user-route";
import {authRouter} from "./routes/auth-router";

export const app = express()

app.use(express.json())

app.use('/testing', testingRoute)
// app.use('/videos', videoRoute)
app.use('/blogs', blogRoute)
app.use('/posts', postRoute)
app.use('/users', userRoute)
app.use('/auth', authRouter)

export const settings = {
    JWT_SECRET: process.env.JWT_SECRET || '123'
}




