import {Router, Request, Response} from "express";
import {PostRepository} from "../repositories/post-repository";
import {HTTP_STATUSES} from "../settings";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "../types/common";
import {postValidation} from "../validators/post-validator";
import {CreatePostInputModel, PostParams, UpdatePostInputModel} from "../types/post/input";
import {OutputPostType} from "../types/post/output";

export const postRoute = Router({})

postRoute.get('/', async (req: Request, res: Response<OutputPostType[]>) => {
    const posts = await PostRepository.getAllPosts()
    res.status(200).send(posts)
})

postRoute.get('/:id', async (req: RequestWithParams<PostParams>, res: Response<OutputPostType>) => {
    const id = req.params.id
    const post = await PostRepository.getPostById(id)
    if (!post) {
        res.sendStatus(404)
    }
    res.status(200).send(post!)
})

postRoute.post('/', authMiddleware, postValidation(), async (req: RequestWithBody<CreatePostInputModel>,
                                                       res: Response) => {
    let {title, shortDescription, content, blogId}: CreatePostInputModel = req.body
    const postId = await PostRepository.createPost({title, shortDescription, content, blogId})
    if (postId) {
        const newPost = await PostRepository.getPostById(postId)
        if (newPost) {
            res.sendStatus(HTTP_STATUSES.CREATED_201).send(newPost)
        }
    }
    res.sendStatus(404)
})

postRoute.put('/:id', authMiddleware, postValidation(), async (req: RequestWithParamsAndBody<PostParams, UpdatePostInputModel>,
                                                         res: Response) => {
    const id = req.params.id
    let {title, shortDescription, content, blogId}: UpdatePostInputModel = req.body

    const isUpdated = await PostRepository.updatePost({title, shortDescription, content, blogId}, id)
    isUpdated ? res.sendStatus(204) : res.sendStatus(404)
})

postRoute.delete('/:id', authMiddleware, async (req: RequestWithParams<PostParams>, res: Response) => {
    const id = req.params.id
    const deleteResult = await PostRepository.deletePost(id)
    deleteResult ? res.sendStatus(204) : res.sendStatus(404)
})

