import {BlogType, OutputBlogType, OutputItemsBlogType} from "../types/blog/output";
import {CreateBlogInputModel, SortBlogsDataType, UpdateBlogInputModel} from "../types/blog/input";
import {blogCollection} from "../db/db";
import {ObjectId} from "mongodb";
import {blogMapper} from "../types/blog/mapper";
import {randomUUID} from "crypto";

export class BlogRepository {
    static async getAllBlogs(sortData: SortBlogsDataType): Promise<OutputBlogType> {
        const searchNameTerm = sortData.searchNameTerm ?? null
        const sortBy = sortData.sortBy ?? 'createdAt'
        const sortDirection = sortData.sortDirection ?? 'desc'
        const pageNumber = sortData.pageNumber ?? 1
        const pageSize = sortData.pageSize ?? 10

        let filter = {}

        if (searchNameTerm) {
            filter = {
                name: {
                    $regex: searchNameTerm,
                    $options: 'i'
                }
            }
        }

        const blogs = await blogCollection
            .find(filter)
            .sort(sortBy, sortDirection)
            .skip((+pageNumber - 1) * +pageSize)
            .limit(+pageSize)
            .toArray()

        const totalCount = await blogCollection
            .countDocuments(filter)

        const pageCount = Math.ceil(totalCount / +pageSize)

        return {
            pagesCount: pageCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: +totalCount,
            items: blogs.map(blogMapper)
        }
    }

    static async getBlogById(id: string): Promise<OutputItemsBlogType | null> {
        try {
            const blog = await blogCollection.findOne({id})
            console.log(blog)
            if (!blog) {
                return null
            }
            return blogMapper(blog)
        } catch (err) {
            return null
        }
    }

    static async createBlog(newBlog: OutputItemsBlogType): Promise<boolean | null> {
        try {
            const result = await blogCollection.insertOne(newBlog)
            return result.acknowledged
        } catch (error) {
            console.log(error)
            return null
        }

    }

    static async updateBlog(params: UpdateBlogInputModel, id: string): Promise<boolean> {
        try {
            const result = await blogCollection.updateOne({id: id}, {
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
            const result = await blogCollection.deleteOne({id: id})
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