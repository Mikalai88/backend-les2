import {Router, Request, Response} from "express";
import {db} from "../db/db";
import {BlogRepository} from "../repositories/blog-repository";
import {RequestWithParams} from "../types/common";
import {HTTP_STATUSES} from "../settings";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {blogValidation} from "../validators/blogs-validator";
import {randomUUID} from "crypto";

export const blogRoute = Router({})

blogRoute.get('/', (req: Request, res: Response) => {
    const blogs = BlogRepository.getAllBlogs()
    res.status(HTTP_STATUSES.OK_200).send(blogs)
})

blogRoute.get('/:id', (req: Request, res: Response) => {
    const id = req.params.id
    const blog = BlogRepository.getBlogById(id)

    if (!blog) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    res.status(HTTP_STATUSES.OK_200).send(blog)
})

blogRoute.post('/', authMiddleware, blogValidation(), (req: Request, res: Response) => {
    const newBlog = {
        id: randomUUID(),
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl
    }

    BlogRepository.createNewBlog(newBlog)

    res.status(HTTP_STATUSES.CREATED_201).send(newBlog)
})

blogRoute.put('/:id', authMiddleware, blogValidation(), (req: Request, res: Response) => {
    const id = req.params.id
    let blog = BlogRepository.getBlogById(id)
    let {name, description, websiteUrl} = req.body

    if(!blog) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    (blog!.name = name),
    (blog!.description = description),
    (blog!.websiteUrl = websiteUrl)

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

blogRoute.delete('/:id', authMiddleware, (req: Request, res: Response) => {
    const id = req.params.id
    const blog = BlogRepository.getBlogById(id)
    if (!blog) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
    const blogIndex = db.blogs.findIndex(b => b.id === id)
    if (blogIndex === -1) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    db.blogs.splice(blogIndex, 1)
    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)

})

