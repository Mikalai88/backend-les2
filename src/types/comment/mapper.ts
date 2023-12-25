
import {CommentViewModel} from "./output";
import {WithId} from "mongodb";

export const mapComment = (comment: WithId<CommentViewModel>) => {
    return {
        id: comment.id,
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt
    }
}