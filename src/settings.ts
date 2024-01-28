import express, {Request, Response} from "express";
// import {videoRoute} from "./routes/video-route";
import {blogRoute} from "./routes/blog-route";
import {postRoute} from "./routes/post-route";
import {testingRoute} from "./routes/testing-route";
import {userRoute} from "./routes/user-route";
import {authRouter} from "./routes/auth-router";
import {commentRouter} from "./routes/comment-router";
import cookieParser from "cookie-parser";
import {securityDevicesRouter} from "./routes/security-devices-router";


export const app = express()

app.use(express.json())
app.use(cookieParser())

app.use((req, res, next) => {

    console.log(req.body);

    next(); // Переход к следующему middleware
});

app.use('/testing', testingRoute)
// app.use('/videos', videoRoute)
app.use('/blogs', blogRoute)
app.use('/posts', postRoute)
app.use('/users', userRoute)
app.use('/auth', authRouter)
app.use('/comments', commentRouter)
app.use('/devices', securityDevicesRouter)

export const settings = {
    JWT_SECRET: process.env.JWT_SECRET || '123'
}




