import {Router, Response} from "express";
import {BlogRepository} from "../repositories/blog-repository";
import {
    RequestWithQuery,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery
} from "../types/common";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {blogValidation} from "../validators/blogs-validator";
import {OutputBlogType, OutputItemsBlogType} from "../types/blog/output";
import {
    BlogParams,
    CreateBlogInputModel,
    CreatePostForBlogInputModel,
    SortBlogsDataType,
    UpdateBlogInputModel
} from "../types/blog/input";
import {OutputPostType} from "../types/post/output";
import {PostRepository} from "../repositories/post-repository";
import {BlogService} from "../domain/blog-service";
import {postToBlogValidation} from "../validators/post-to-blog-validator";

export const blogRoute = Router({})

blogRoute.get('/', async (req: RequestWithQuery<SortBlogsDataType>,
                    res: Response<OutputBlogType>) => {
    const sortData = {
        searchNameTerm: req.query.searchNameTerm,
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection,
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize
    }
    const blogs: OutputBlogType = await BlogRepository.getAllBlogs(sortData)
    res.status(200).send(blogs)
})

blogRoute.get('/:id/posts', async (req: RequestWithParamsAndQuery<BlogParams, SortBlogsDataType>,
                          res: Response) => {
    const blogId = req.params.id // blogIdInParamsMiddleware

    if (!blogId) {
        res.sendStatus(404)
        return
    }

    const sortData = {
        searchNameTerm: req.query.searchNameTerm,
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection,
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize
    }
    const posts: OutputPostType | null = await PostRepository.getAllPostsInBlog(blogId, sortData)

    if (!posts) {
        res.sendStatus(404)
        return
    }
    res.status(200).send(posts)
})

blogRoute.get('/:id', async (req: RequestWithParams<BlogParams>,
                       res: Response<OutputItemsBlogType>) => {
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
    const blogId = await BlogService.createBlog({name, description, websiteUrl})
    if (!blogId) {
        return res.sendStatus(404)
    }
    const newBlog = await BlogRepository.getBlogById(blogId)
    return res.status(201).send(newBlog)
})

blogRoute.post('/:id/posts', authMiddleware, postToBlogValidation(), async (req: RequestWithParamsAndBody<BlogParams, CreatePostForBlogInputModel>, res: Response) => {
    const blogId = req.params.id
    const {title, shortDescription, content} = req.body

    const postId: string | null = await BlogService.createPostToBlog(blogId,{title, shortDescription, content})

    if (!postId) {
        res.sendStatus(404)
        return
    }

    const post = PostRepository.getPostById(postId)

    res.send(post)
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

