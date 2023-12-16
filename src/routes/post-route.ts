import {Router, Request, Response} from "express";
import {PostRepository} from "../repositories/post-repository";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../types/common";
import {postValidation} from "../validators/post-validator";
import {CreatePostInputModel, PostParams, SortPostsDataType, UpdatePostInputModel} from "../types/post/input";
import {OutputItemsPostType, OutputPostType, PostType} from "../types/post/output";
import {PostService} from "../domain/post-service";

export const postRoute = Router({})

postRoute.get('/', async (req: RequestWithQuery<SortPostsDataType>, res: Response<OutputPostType>) => {
    const sortData = {
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection,
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize
    }
    const posts: OutputPostType = await PostRepository.getAllPosts(sortData)
    res.status(200).send(posts)
})

postRoute.get('/:id', async (req: RequestWithParams<PostParams>, res: Response<OutputItemsPostType>) => {
    const id = req.params.id

    console.log('ID / postRoute.get/:id', id)

    const post = await PostRepository.getPostById(id)
    if (!post) {
        return res.sendStatus(404)
    }
    return res.status(200).send(post!)
})

postRoute.post('/', authMiddleware, postValidation(), async (req: RequestWithBody<CreatePostInputModel>,
                                                             res: Response<PostType | null>) => {
    let {title, shortDescription, content, blogId}: CreatePostInputModel = req.body
    const postId = await PostService.createPost({title, shortDescription, content, blogId})
    if (!postId) {
        return res.sendStatus(404)
    }
    const newPost = await PostRepository.getPostById(postId)
    return res.status(201).send(newPost)
})

postRoute.put('/:id', authMiddleware, postValidation(), async (req: RequestWithParamsAndBody<PostParams, UpdatePostInputModel>,
                                                               res: Response) => {
    const id = req.params.id
    let {title, shortDescription, content, blogId}: UpdatePostInputModel = req.body

    console.log('REQ.BODY', req.body)

    const isUpdated = await PostService.updatePost({title, shortDescription, content, blogId}, id)

    console.log('isUpdated', isUpdated)

    isUpdated ? res.sendStatus(204) : res.sendStatus(404)
})

postRoute.delete('/:id', authMiddleware, async (req: RequestWithParams<PostParams>, res: Response) => {
    const id = req.params.id
    const deleteResult = await PostRepository.deletePost(id)
    deleteResult ? res.sendStatus(204) : res.sendStatus(404)
})

