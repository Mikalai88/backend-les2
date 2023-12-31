import {commentRepository} from "../repositories/comment-repository";
import {commentCollection} from "../db/db";
import {OutputItemsUserType} from "../types/user/output";
import {UserRepository} from "../repositories/user-repository";
import {PostRepository} from "../repositories/post-repository";
import {CommentDbModel} from "../types/comment/output";
import {CommentClass} from "../classes/comment-class";

export interface ResultCodeHandler<T> {
    success: boolean
    data: T | null
    error?: string
}

export const resultCodeMap = <T>(success: boolean, data: T, error?: string) => {
    return {
        success: success,
        data: data,
        error: error
    }
};

export class commentService {
    static async createNewComment(content: string, userId: string, postId: string): Promise<string | null> {
        const user: OutputItemsUserType | null = await UserRepository.findUserById(userId)
        if (!user) {
            return null
        }
        const post = await PostRepository.getPostById(postId)
        if (!post) {
            return null
        }
        const userDto = {
            userId: user.id,
            userLogin: user.login
        }
        const newComment: CommentDbModel = new CommentClass(content, userDto, postId)
        const result = await commentRepository.createNewComment(newComment)
        if (!result) {
            return null
        }
        return newComment.id
    }
    static async updateComments(content: string, userId: string, commentId: string): Promise<ResultCodeHandler<null>> {
        const comment = await commentRepository.findCommentById(commentId)
        if (!comment) {
            return resultCodeMap(false, null, "Not_Found")
        }
        if (userId !== comment.commentatorInfo.userId) {
            return resultCodeMap(false, null, "Forbidden")
        }
        const updateComment = {content: content}
        const resultUpdate = await commentRepository.updateCommentById(updateComment, commentId)
        if (!resultUpdate) {
            return resultCodeMap(false, null, "Error_Server")
        }
        return resultCodeMap(true, null)
    }

    static async deleteComment(id: string, userId: string): Promise<ResultCodeHandler<null>> {
        const comment = await commentRepository.findCommentById(id)
        if (!comment) {
            return resultCodeMap(false, null, "Not_Found")
        }
        if (userId !== comment.commentatorInfo.userId) {
            return resultCodeMap(false, null, "Forbidden")
        }
        const deletedComment = commentRepository.deleteComment(id)
        if (!deletedComment) {
            return resultCodeMap(false, null, "Error_Server")
        }
        return resultCodeMap(true, null)
    }
}