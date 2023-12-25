import {commentCollection} from "../db/db";
import {CommentViewModel} from "../types/comment/output";

export class commentRepository {
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
}