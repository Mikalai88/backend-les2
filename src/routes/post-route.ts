import {Router, Request, Response} from "express";
import {PostRepository} from "../repositories/post-repository";
import {HTTP_STATUSES} from "../settings";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {RequestWithParams} from "../types/common";
import {postValidation} from "../validators/post-validator";
import {randomUUID} from "crypto";
import {db} from "../db/db";
import {BlogRepository} from "../repositories/blog-repository";

export const postRoute = Router({})

postRoute.get('', () => {

})

postRoute.get('/', (req: Request, res: Response) => {
    const posts = PostRepository.getAllPosts
    res.status(HTTP_STATUSES.OK_200).send(posts)
})

postRoute.get('/:id', authMiddleware, (req: Request, res: Response) => {
    const id = req.params.id
    const blog = PostRepository.getPostById(id)

    if (!blog) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    res.status(HTTP_STATUSES.OK_200).send(blog)
})

postRoute.post('/', authMiddleware, postValidation(), (req: Request, res: Response) => {
    const blog = BlogRepository.getBlogById(req.body.blogId)

    if (!blog) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

    const newPost = {
        id: randomUUID(),
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId,
        blogName: blog.name
    }

    PostRepository.createNewPost(newPost)

    return res.status(HTTP_STATUSES.CREATED_201).send(newPost)
})

postRoute.put('/:id', authMiddleware, postValidation(), (req: Request, res: Response) => {
    const id = req.params.id
    let post = PostRepository.getPostById(id)
    let {title, shortDescription, content, blogId} = req.body

    if(!post) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    (post!.title = title),
    (post!.shortDescription = shortDescription),
    (post!.content = content),
    (post!.blogId = blogId)

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

postRoute.delete('/:id', authMiddleware, (req: Request, res: Response) => {
    const id = req.params.id
    const post = PostRepository.getPostById(id)
    if (!post) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
    const postIndex = db.posts.findIndex(p => p.id === id)
    if (postIndex === -1) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    db.posts.splice(postIndex, 1)
    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)

})

