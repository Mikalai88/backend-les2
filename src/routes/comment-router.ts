import {Router, Request, Response} from "express";
import {authJWTMiddleware, authMiddleware, checkAuthUser} from "../middlewares/auth/auth-middleware";
import {idValidationMiddleware} from "../middlewares/id-validation-middleware";
import {RequestWithParams} from "../types/common";
import {CommentViewModel} from "../types/comment/output";
import {CommentsQueryRepository} from "../repositories/query-repositories/comments-query-repository";
import {commentsValidationMiddleware} from "../validators/comments-validator";
import {commentService, ResultCodeHandler} from "../domain/comment-service";

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

commentRouter
    .get('/:id', checkAuthUser, idValidationMiddleware, async (req: RequestWithParams<{ id: string }>, res) => {
        const comment: CommentViewModel | null = await CommentsQueryRepository.findCommentById(req.params.id, req.user?.id)
        if(!comment) {
            return res.sendStatus(404)
        }
        return res.status(200).send(comment)
    })
    .put('/:id', authJWTMiddleware, idValidationMiddleware, commentsValidationMiddleware, async (req: Request, res: Response) => {
    const resultUpdate = await commentService.updateComments(req.body, req.user!.id, req.params.id)
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
.delete('/id', authJWTMiddleware, idValidationMiddleware, async (req: Request, res: Response) => {
    const resultDelete = await commentService.deleteComment(req.params.id, req.user!.id)
    if(!resultDelete.success) {
        return res.sendStatus(resultCodeHandler(resultDelete))
    }
    return res.sendStatus(204)
})