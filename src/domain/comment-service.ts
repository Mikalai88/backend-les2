import {commentRepository} from "../repositories/comment-repository";
import {commentCollection} from "../db/db";

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
    static async updateComments(body: {content: string}, userId: string, commentId: string): Promise<ResultCodeHandler<null>> {
        const comment = await commentRepository.findCommentById(commentId)
        if (!comment) {
            return resultCodeMap(false, null, "Not_Found")
        }
        if (userId !== comment.commentatorInfo.userId) {
            return resultCodeMap(false, null, "Forbidden")
        }
        const updateComment = {content: body.content}
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