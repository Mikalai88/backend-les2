import {BlogType, OutputBlogType} from "../types/blog/output";
import {CreateBlogInputModel, UpdateBlogInputModel} from "../types/blog/input";
import {blogCollection} from "../db/db";
import {ObjectId} from "mongodb";
import {blogMapper} from "../types/blog/mapper";
import {randomUUID} from "crypto";

export class BlogRepository {
    static async getAllBlogs() {
        const blogs = await blogCollection.find({}).toArray()
        return blogs.map(blogMapper)
    }

    static async getBlogById(id: string): Promise<OutputBlogType | null> {
        try {
            const blog = await blogCollection.findOne({_id: new ObjectId(id)})
            if (!blog) {
                return null
            }
            return blogMapper(blog)
        } catch (err) {
            return null
        }
    }

    static async createBlog(params: CreateBlogInputModel): Promise<string> {
            const createdAt = new Date()
            const newBlog: OutputBlogType = {
                id: randomUUID(),
                name: params.name,
                description: params.description,
                websiteUrl: params.websiteUrl,
                createdAt: createdAt.toISOString(),
                isMembership: false
            }
            const result = await blogCollection.insertOne(newBlog)
            return result.insertedId.toString()
    }

    static async updateBlog(params: UpdateBlogInputModel, id: string): Promise<boolean> {
        try {
            const result = await blogCollection.updateOne({_id: new ObjectId(id)}, {
                $set: {
                    name: params.name,
                    description: params.description,
                    websiteUrl: params.websiteUrl
                }
            })

            return !!result.matchedCount
        } catch (err) {
            return false
        }


        // const blogIndex: number = db.blogs.findIndex(b => b.id === id)
        // const blog = this.getBlogById(id)
        // if (!blog) {
        //     return false
        // }
        // const updatedBlog: OutputBlogType = {
        //     ...blog,
        //     name: params.name,
        //     description: params.description,
        //     websiteUrl: params.websiteUrl
        // }
        // db.blogs.splice(blogIndex, 1, updatedBlog)
        // return true
    }

    static async deleteBlog(id: string): Promise<boolean> {
        try {
            const result = await blogCollection.deleteOne({_id: new ObjectId(id)})
            return !!result.deletedCount
        } catch (err) {
            return false
        }

        // const blogIndex: number = db.blogs.findIndex(b => b.id === id)
        // if(blogIndex === -1) {
        //     return false
        // }
        // db.blogs.splice(blogIndex, 1)
        // return true
    }
}