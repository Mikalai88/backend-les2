import {postCollection} from "../db/db";
import {OutputPostType, PostType} from "../types/post/output";
import {CreatePostInputModel, UpdatePostInputModel} from "../types/post/input";
import {randomUUID} from "crypto";
import {BlogRepository} from "./blog-repository";
import {OutputBlogType} from "../types/blog/output";
import {ObjectId, WithId} from "mongodb";
import {postMapper} from "../types/post/mapper";

export class PostRepository {
    static async getAllPosts(): Promise<OutputPostType[]> {
        const posts: WithId<PostType>[] = await postCollection.find({}).toArray()
        return posts.map(postMapper)
    }

    static async getPostById(id: string): Promise<OutputPostType | null> {
        try {
            const post = await postCollection.findOne({_id: new ObjectId(id)})
            if (!post) {
                return null
            }
            return postMapper(post)
        } catch (err) {
            return null
        }
    }

    static async createPost(params: CreatePostInputModel) {
        try {
            const createdAt = new Date()
            const blog: OutputBlogType | null = await BlogRepository.getBlogById(params.blogId)
            if (blog) {
                const newPost: PostType = {
                    ...params,
                    blogName: blog.name,
                    createdAt: createdAt.toISOString()
                }
                const result = await postCollection.insertOne(newPost)
                return result.insertedId.toString()
            } else {
                return null
            }
        } catch (err) {
            return null
        }
    }

    static async updatePost(params: UpdatePostInputModel, id: string) {
        const blog = await BlogRepository.getBlogById(params.blogId)
        const result = await postCollection.updateOne({_id: new ObjectId(id)},
            {
                $set: {
                    title: params.title,
                    shortDescription: params.shortDescription,
                    content: params.content,
                    blogId: params.blogId
                }
            }
            )
        return !!result.matchedCount
    }

    static async deletePost(id: string) {
        try {
            const result = await postCollection.deleteOne({_id: new ObjectId(id)})
            return !!result.deletedCount
        } catch (err) {
            return false
        }
    }
}