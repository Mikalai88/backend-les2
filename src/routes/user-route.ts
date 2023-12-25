import {Request, Response, Router} from "express";
import {usersService} from "../domain/user-service";
import {RequestWithParams, RequestWithQuery} from "../types/common";
import {SortUsersDataType} from "../types/user/input";
import {OutputBlogType, OutputItemsBlogType} from "../types/blog/output";
import {BlogRepository} from "../repositories/blog-repository";
import {OutputUserType} from "../types/user/output";
import {UserRepository} from "../repositories/user-repository";
import {BlogParams} from "../types/blog/input";
import {blogRoute} from "./blog-route";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {userCreateValidator} from "../validators/user-validator";

export const userRoute = Router({})

userRoute.get('/', authMiddleware, async (req: RequestWithQuery<SortUsersDataType>, res: Response) => {
    const sortData = {
        searchLoginTerm: req.query.searchLoginTerm,
        searchEmailTerm: req.query.searchEmailTerm,
        sortBy: req.query.sortBy === 'login' ? 'userLogin' : req.query.sortBy === 'email' ? 'userEmail' : req.query.sortBy,
        sortDirection: req.query.sortDirection,
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize
    }
    const users: OutputUserType = await UserRepository.getAllUsers(sortData)
    res.status(200).send(users)
})

userRoute.post('/', authMiddleware, userCreateValidator(), async (req: Request, res: Response) => {
    const userId = await usersService.createUser(req.body.login, req.body.email, req.body.password)
    if (!userId) {
        res.sendStatus(404)
    }
    const newUser = await UserRepository.getUserById(userId!)
    res.status(201).send(newUser)
})

userRoute.delete('/:id', authMiddleware, async (req: RequestWithParams<BlogParams>, res: Response) => {
    const id = req.params.id
    const deleteResult = await usersService.deleteUser(id)
    deleteResult ? res.sendStatus(204) : res.sendStatus(404)
})

//