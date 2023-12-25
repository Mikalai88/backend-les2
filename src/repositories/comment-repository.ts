import {commentCollection} from "../db/db";
import {CommentDbModel, CommentViewModel} from "../types/comment/output";
import {CommentPaginationModel} from "../routes/post-route";
import {CommentPaginationViewModel} from "../types/comment/input";
import {WithId} from "mongodb";
import {mapComment} from "../types/comment/mapper";

export enum SortByEnum {
    createdAt = 'createdAt',
    blogId = 'blogId',
    postId = 'postId'
}

export class commentRepository {
    private static _aggregationOfQueryParameters(query: CommentPaginationModel): Required<CommentPaginationModel> {
        const paramSortPagination = {
            sortBy: query.sortBy || SortByEnum.createdAt,
            sortDirection: query.sortDirection || "desc",
            pageNumber: query.pageNumber || 1,
            pageSize: query.pageSize || 10
        }
        return paramSortPagination
    }

    private static async _processingPagesAndNumberOfDocuments(pageNumber: number, pageSize: number, value?: string, field?: string) {
        const skipPage = (pageNumber - 1) * pageSize
        const filter = field !== undefined ? {[field]: value} : {}
        const totalCount = await commentCollection.countDocuments(filter)
        const pagesCount = Math.ceil(totalCount / pageSize)
        return {
            skipPage,
            totalCount,
            pagesCount
        }
    }

    static async createNewComment(newComment: CommentDbModel): Promise<boolean> {
        const resultInsert = await commentCollection.insertOne(newComment)
        return resultInsert.acknowledged
    }
    static async findCommentById(id: string): Promise<CommentViewModel | null> {
        return commentCollection.findOne({id: id})
    }

    static async updateCommentById(newComment: {content: string}, commentId: string): Promise<boolean> {
        const resultUpdate = await commentCollection.updateOne({id: commentId}, {$set: newComment})
        return resultUpdate.matchedCount === 1
    }

    static async deleteComment(id: string): Promise<boolean> {
        const resultDelete = await commentCollection.deleteOne({id: id})
        return resultDelete.deletedCount === 1
    }

    static async findAllCommentByPostId(query: CommentPaginationModel, postId: string, userId?: string | null): Promise<CommentPaginationViewModel | null> {
        const aggregationResult = this._aggregationOfQueryParameters(query)
        const {sortBy, sortDirection, pageNumber, pageSize} = aggregationResult

        const processingResult = await this._processingPagesAndNumberOfDocuments(pageNumber, pageSize, postId, SortByEnum.postId)
        const {skipPage, pagesCount, totalCount} = processingResult

        const commentsArray: WithId<CommentViewModel>[] = await commentCollection
            .find({postId: postId})
            .sort({[sortBy]: sortDirection})
            .limit(+pageSize)
            .skip(skipPage)
            .toArray()

        if (commentsArray.length <= 0) {
            return null
        }

        const commentItems = []
        for (const comment of commentsArray) {
            commentItems.push(mapComment(comment))
        }

        return {
            pagesCount: pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: commentItems
        }
    }
    
}