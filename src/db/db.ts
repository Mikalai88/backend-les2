import {MongoClient} from "mongodb";
import dotenv from 'dotenv'
dotenv.config()

export const port = 3001

const mongoUri = 'mongodb+srv://admin:admin@cluster0.vsonmz0.mongodb.net/?retryWrites=true&w=majority'
// process.env.MONGO_URL ||

const client = new MongoClient(mongoUri)

const db = client.db('node-blog')

export const blogCollection = db.collection<BlogType>('blog')
export const postCollection = db.collection<PostType>('post')
export const videoCollection = db.collection<VideoType>('video')
export const userCollection = db.collection<UserType>('user')
export const commentCollection = db.collection<CommentViewModel>('comment')
export const RequestCountsModel = db.collection<TypeRequestCount>('api_requests')
export const DevicesModel = db.collection<DevicesDbModel>('api_requests')

export const runDb = async () => {
    try {
        await client.connect()
        await client.db("admin").command({ping: 1})
        console.log('Client connected to DB')
        console.log(`listen on port ${port}`)
    } catch (e) {
        console.log(`${e}`)
        await client.close()
    }
}



import {VideoType} from "../types/video/output";
import {BlogType, OutputBlogType} from "../types/blog/output";
import {OutputItemsPostType, PostType} from "../types/post/output";
import {UserType} from "../types/user/output";
import {CommentViewModel} from "../types/comment/output";
import {TypeRequestCount} from "../types/api/api-request-model";
import {EmailConfirmationModel} from "../types/email";
import {DevicesDbModel} from "../types/devices-db-model";

// type DBType = {
//     videos: VideoType[]
//     blogs: BlogType[]
//     posts: PostType[]
// }

// export const db: DBType = {
//     videos: [
//         {
//             id: 1,
//             title: "string",
//             author: "string",
//             canBeDownloaded: true,
//             minAgeRestriction: null,
//             createdAt: "2023-11-06T15:58:00.351Z",
//             publicationDate: "2023-11-06T15:58:00.351Z",
//             availableResolutions: ["P144"]
//         }
//     ],
//     blogs: [{
//         id: "string",
//         name: "string",
//         description: "string",
//         websiteUrl: "string"
//     }],
//     posts: [{
//             id: "string",
//             title: "string",
//             shortDescription: "string",
//             content: "string",
//             blogId: "string",
//             blogName: "string"
//     }]
// }

//kjhgf