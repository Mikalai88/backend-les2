import {Router, Request, Response} from "express";
import {authJWTMiddleware, authMiddleware, checkAuthUser} from "../middlewares/auth/auth-middleware";
import {idValidationMiddleware} from "../middlewares/id-validation-middleware";
import {RequestWithParams} from "../types/common";
import {CommentViewModel} from "../types/comment/output";
import {CommentsQueryRepository} from "../repositories/query-repositories/comments-query-repository";
import {commentsValidationMiddleware} from "../validators/comments-validator";
import {commentService, ResultCodeHandler} from "../domain/comment-service";
import {log} from "util";

export const commentRouter = Router({})

export const resultCodeHandler = <T>(obj: ResultCodeHandler<T>) => {
    switch (obj.error) {
        case "Not_Found":
            return 404
        case "Forbidden":
            return 403
        default:
            return 500
    }
}

commentRouter.get('/:id', async (req: RequestWithParams<{ id: string }>, res) => {
        const comment: CommentViewModel | null = await CommentsQueryRepository.findCommentById(req.params.id)
    console.log("comment", comment)
        if(!comment) {
            return res.sendStatus(404)
        }
        return res.status(200).send(comment)
    })

commentRouter.put('/:id', authJWTMiddleware, commentsValidationMiddleware(), async (req: Request, res: Response) => {
    const resultUpdate = await commentService.updateComments(req.body.content, req.user!.id, req.params.id)
    console.log("req.body", req.body)
    if (resultUpdate.success) {
        return res.sendStatus(204)
    }
    if (resultUpdate.error === "Not_Found") {
        return res.sendStatus(404)
    }
    if (resultUpdate.error === "Forbidden") {
        return res.sendStatus(403)
    }
    return res.sendStatus(500)
})
commentRouter.delete('/:id', authJWTMiddleware, async (req: Request, res: Response) => {
    const resultDelete = await commentService.deleteComment(req.params.id, req.user!.id)
    if(!resultDelete.success) {
        return res.sendStatus(resultCodeHandler(resultDelete))
    }
    return res.sendStatus(204)
})