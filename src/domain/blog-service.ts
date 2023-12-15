import {BlogRepository} from "../repositories/blog-repository";
import {CreateBlogInputModel, CreatePostForBlogInputModel} from "../types/blog/input";
import {PostRepository} from "../repositories/post-repository";
import {OutputItemsBlogType} from "../types/blog/output";
import {randomUUID} from "crypto";
import {blogCollection, postCollection} from "../db/db";
import {PostType} from "../types/post/output";

export class BlogService {
    static async createBlog(input: CreateBlogInputModel) {
        const createdAt = new Date()
        const newBlog: OutputItemsBlogType = {
            id: randomUUID(),
            name: input.name,
            description: input.description,
            websiteUrl: input.websiteUrl,
            createdAt: createdAt.toISOString(),
            isMembership: false
        }
        const result = await BlogRepository.createBlog(newBlog)
        if (!result) {
            return null
        }
        return newBlog.id
    }

    static async createPostToBlog(blogId: string, postData: CreatePostForBlogInputModel) {
        const blog = await BlogRepository.getBlogById(blogId)

        if (!blog) {
            return null
        }

        const createdAt = new Date()

        try {
            const newPost: PostType = {
                id: randomUUID(),
                title: postData.title,
                shortDescription: postData.shortDescription,
                content: postData.content,
                blogName: blog.name,
                createdAt: createdAt.toISOString(),
                blogId: blogId
            }

            const result = await PostRepository.createPostToBlog(newPost)
            if (!result) {
                return null
            }
            return newPost.id

        } catch (err) {
            return null
        }
    }
}