import {blogCollection, postCollection} from "../db/db";
import {OutputItemsPostType, OutputPostType, PostType} from "../types/post/output";
import {CreatePostInputModel, SortPostsDataType, UpdatePostInputModel} from "../types/post/input";
import {randomUUID} from "crypto";
import {BlogRepository} from "./blog-repository";
import {OutputBlogType, OutputItemsBlogType} from "../types/blog/output";
import {ObjectId, WithId} from "mongodb";
import {postMapper} from "../types/post/mapper";
import {blogMapper} from "../types/blog/mapper";
import {SortBlogsDataType} from "../types/blog/input";
import {PostService} from "../domain/post-service";

export class PostRepository {
    static async getAllPosts(sortData: SortPostsDataType): Promise<OutputPostType> {
        // const posts: WithId<PostType>[] = await postCollection.find({}).toArray()
        // return posts.map(postMapper)

        const sortBy = sortData.sortBy ?? 'createdAt'
        const sortDirection = sortData.sortDirection ?? 'desc'
        const pageNumber = sortData.pageNumber ?? 1
        const pageSize = sortData.pageSize ?? 10

        const posts = await postCollection
            .find({})
            .sort(sortBy, sortDirection)
            .skip((+pageNumber - 1) * +pageSize)
            .limit(+pageSize)
            .toArray()

        const totalCount = await postCollection
            .countDocuments({})

        const pageCount = Math.ceil(totalCount / +pageSize)

        return {
            pagesCount: pageCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: +totalCount,
            items: posts.map(postMapper)
        }
    }

    static async getPostById(id: string): Promise<OutputItemsPostType | null> {
        try {
            console.log('ID / getPostById / PostRepository', id)

            const post = await postCollection.findOne({id})
            if (!post) {
                console.log('!post Repository')
                return null
            }
            return postMapper(post)
        } catch (err) {
            console.log('Error PostRepository', err)
            return null
        }
    }

    static async getAllPostsInBlog(blogId: string, sortData: SortBlogsDataType): Promise<OutputPostType> {
        const sortBy = sortData.sortBy ?? 'createdAt'
        const sortDirection = sortData.sortDirection ?? 'desc'
        const pageNumber = sortData.pageNumber ?? 1
        const pageSize = sortData.pageSize ?? 10



        const posts = await postCollection
            .find({blogId: blogId})
            .sort(sortBy, sortDirection)
            .skip((+pageNumber - 1) * +pageSize)
            .limit(+pageSize)
            .toArray()

        const totalCount = await postCollection
            .countDocuments({blogId: blogId})

        const pageCount = Math.ceil(totalCount / +pageSize)

        return {
            pagesCount: pageCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: +totalCount,
            items: posts.map(postMapper)
        }
    }

    static async createPost(newPost: PostType) {
        const result = await postCollection.insertOne(newPost)
        return result.acknowledged
    }

    static async createPostToBlog(newPost: PostType) {
        const result = await postCollection.insertOne(newPost)
        return result.acknowledged
    }

    static async updatePost(post: PostType) {
        const result = await postCollection.updateOne({id: post.id}, {$set: post})
        return result.matchedCount > 0
    }

    static async deletePost(id: string) {
        try {
            const result = await postCollection.deleteOne({id: id})
            return !!result.deletedCount
        } catch (err) {
            return false
        }
    }
}