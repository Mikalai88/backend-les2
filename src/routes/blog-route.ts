import {Router, Request, Response} from "express";
import {BlogRepository} from "../repositories/blog-repository";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "../types/common";
import {HTTP_STATUSES} from "../settings";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {blogValidation} from "../validators/blogs-validator";
import {OutputBlogType} from "../types/blog/output";
import {BlogParams, CreateBlogInputModel, UpdateBlogInputModel} from "../types/blog/input";

export const blogRoute = Router({})

blogRoute.get('/', async (req: Request,
                    res: Response<OutputBlogType[]>) => {
    const blogs = await BlogRepository.getAllBlogs()
    res.status(200).send(blogs)
})

blogRoute.get('/:id', async (req: RequestWithParams<BlogParams>,
                       res: Response<OutputBlogType>) => {
    const id = req.params.id
    const blog = await BlogRepository.getBlogById(id)
    if (!blog) {
        res.sendStatus(404)
        return
    } else {
        res.status(200).send(blog)
    }
})

blogRoute.post('/', authMiddleware, blogValidation(), async (req: RequestWithBody<CreateBlogInputModel>,
                                                       res: Response) => {
    let {name, description, websiteUrl}: CreateBlogInputModel = req.body
    const blogId = await BlogRepository.createBlog({name, description, websiteUrl})
    const newBlog = await BlogRepository.getBlogById(blogId)
    if (newBlog) {
        res.status(201).send(newBlog)
        return
    } else {
        res.sendStatus(404)
    }
})

blogRoute.put('/:id', authMiddleware, blogValidation(), async (req: RequestWithParamsAndBody<BlogParams, UpdateBlogInputModel>,
                                                         res: Response) => {
    const id = req.params.id
    let {name, description, websiteUrl}: UpdateBlogInputModel = req.body
    const updateResult = await BlogRepository.updateBlog({name, description, websiteUrl}, id)
    updateResult ? res.sendStatus(204) : res.sendStatus(404)
})

blogRoute.delete('/:id', authMiddleware, async (req: RequestWithParams<BlogParams>, res: Response) => {
    const id = req.params.id
    const deleteResult = await BlogRepository.deleteBlog(id)
    deleteResult ? res.sendStatus(204) : res.sendStatus(404)
})

