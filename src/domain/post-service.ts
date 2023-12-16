import {CreatePostInputModel, UpdatePostInputModel} from "../types/post/input";
import {OutputItemsBlogType} from "../types/blog/output";
import {BlogRepository} from "../repositories/blog-repository";
import {PostType} from "../types/post/output";
import {randomUUID} from "crypto";
import {postCollection} from "../db/db";
import {PostRepository} from "../repositories/post-repository";
import {ObjectId} from "mongodb";
import retryTimes = jest.retryTimes;

export class PostService {
    static async createPost(input: CreatePostInputModel) {
        const createdAt = new Date()
        const blog: OutputItemsBlogType | null = await BlogRepository.getBlogById(input.blogId)

        if (!blog) {
            return null
        }

        const newPost: PostType = {
            ...input,
            id: randomUUID(),
            blogName: blog.name,
            createdAt: createdAt.toISOString()
        }
        const result = await PostRepository.createPost(newPost)

        if (!result) {
            return null
        }

        return newPost.id

    }

    static async updatePost(params: UpdatePostInputModel, id: string) {
        const blog = await BlogRepository.getBlogById(params.blogId)
        if (!blog) {
            console.log('!blog / updatePost / post-service')
            return null
        }
        const post = await PostRepository.getPostById(id)
        if (!post) {
            console.log('!post / updatePost / post-service')
            return null
        }
        post.title = params.title
        post.shortDescription = params.shortDescription
        post.content = params.content
        post.blogId = params.blogId
        post.blogName = blog.name

        const res = await PostRepository.updatePost(post)

        console.log("res / updatePost / post-service", post)

        return res
    }
}