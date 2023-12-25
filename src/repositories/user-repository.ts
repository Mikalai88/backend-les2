import {blogCollection, userCollection} from "../db/db";
import {OutputItemsUserType, OutputUserType, UserType} from "../types/user/output";
import {blogMapper} from "../types/blog/mapper";
import {SortBlogsDataType} from "../types/blog/input";
import {SortUsersDataType} from "../types/user/input";
import {userMapper} from "../types/user/mapper";
import {OutputItemsBlogType} from "../types/blog/output";

export class UserRepository {
    static async getAllUsers(sortData: SortUsersDataType): Promise<OutputUserType> {
        const searchLoginTerm = sortData.searchLoginTerm ?? null
        const searchEmailTerm = sortData.searchEmailTerm ?? null
        const sortBy = sortData.sortBy ?? 'createdAt'
        const sortDirection = sortData.sortDirection ?? 'desc'
        const pageNumber = sortData.pageNumber ?? 1
        const pageSize = sortData.pageSize ?? 10

        const searchEmail = searchEmailTerm !== null ? {userEmail: {$regex: searchEmailTerm, $options: "i"}} : {}
        const searchLogin = searchLoginTerm !== null ? {userLogin: {$regex: searchLoginTerm, $options: 'i'}} : {}

        console.log("FILTER", JSON.stringify({$or: [searchEmail, searchLogin]}))

        const users = await userCollection
            .find({$or: [searchEmail, searchLogin]})
            .sort(sortBy, sortDirection)
            .skip((+pageNumber - 1) * +pageSize)
            .limit(+pageSize)
            .toArray()

        const totalCount = await userCollection
            .countDocuments({$or: [searchEmail, searchLogin]})

        const pageCount = Math.ceil(totalCount / +pageSize)



        return {
            pagesCount: pageCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: +totalCount,
            items: users.map(userMapper)
        }
    }

    static async getUserById(id: string): Promise<OutputItemsUserType | null> {
        try {
            const user = await userCollection.findOne({id})
            if (!user) {
                return null
            }
            return userMapper(user)
        } catch (err) {
            return null
        }
    }

    static async createUser(user: UserType): Promise<boolean> {
        const result = await userCollection.insertOne(user)
        return result.acknowledged
    }

    static async findUserById(id: string): Promise<OutputItemsUserType | null> {
        let user = await userCollection.findOne({id: id})
        if (user) {
            return userMapper(user)
        } else {
            return null
        }
    }

    static async findByLoginOrEmail(loginOrEmail: string) {
        const user = await userCollection.findOne({$or: [{userEmail: loginOrEmail}, {userLogin: loginOrEmail}]})
        return user
    }

    static async deleteUser(id: string) {
        try {
            const result = await userCollection.deleteOne({id: id})
            return !!result.deletedCount
        } catch (err) {
            return false
        }
    }
}