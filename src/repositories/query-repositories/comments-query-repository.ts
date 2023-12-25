import {CommentViewModel} from "../../types/comment/output";
import {mapComment} from "../../types/comment/mapper";
import {commentCollection} from "../../db/db";

export class CommentsQueryRepository {
    static async findCommentById(commentId: string): Promise<CommentViewModel | null> {
        const findComment = await commentCollection.findOne({id: commentId})
        if (!findComment) return null

        return mapComment(findComment)
    }
}