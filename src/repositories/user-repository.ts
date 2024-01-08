import {userCollection} from "../db/db";
import {OutputItemsUserType, OutputUserType, UserType} from "../types/user/output";
import {CodeConfirmModel, SortUsersDataType} from "../types/user/input";
import {userMapper} from "../types/user/mapper";
import {ResultCodeHandler, resultCodeMap} from "../domain/comment-service";
import {EmailConfirmationModel, EmailResending} from "../types/email";

export class UserRepository {
    static async getAllUsers(sortData: SortUsersDataType): Promise<OutputUserType> {
        const searchLoginTerm = sortData.searchLoginTerm ?? null
        const searchEmailTerm = sortData.searchEmailTerm ?? null
        const sortBy = sortData.sortBy ?? 'createdAt'
        const sortDirection = sortData.sortDirection ?? 'desc'
        const pageNumber = sortData.pageNumber ?? 1
        const pageSize = sortData.pageSize ?? 10

        const searchEmail = searchEmailTerm !== null ? {email: {$regex: searchEmailTerm, $options: "i"}} : {}
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
        const user = await userCollection.findOne({$or: [{'emailConfirmation.email': loginOrEmail}, {userLogin: loginOrEmail}]})
        return user
    }

    static async findUserEmail(body: EmailResending) {

        console.log('BODY Email UserRepository', body.email)

        return userCollection.findOne({'emailConfirmation.email': body.email})
    }

    static async resendingEmail(newConfirmationData: EmailConfirmationModel) : Promise<boolean> {
        const resultUpdateConfirmData = await userCollection.updateOne({'emailConfirmation.email': newConfirmationData.email}, {$set: newConfirmationData})
        return resultUpdateConfirmData.acknowledged
    }

    static async confirmUser(body: CodeConfirmModel): Promise<ResultCodeHandler<null>> {

        const findUserEmailByCode = await userCollection.findOne({'emailConfirmation.confirmationCode': body.code})

        if(!findUserEmailByCode) {
            return resultCodeMap(false, null, "Code_No_Valid")
        }
        if(findUserEmailByCode.emailConfirmation.isConfirmed) {
            return resultCodeMap(false, null, "Is_Confirmed")
        }
        if(findUserEmailByCode.emailConfirmation.expirationDate < new Date()) {
            return resultCodeMap(false, null, "Expiration_Date")
        }

        const updateObject = {
                    $set:{'emailConfirmation.isConfirmed': true}}
        ;

        await userCollection.updateOne(
            { 'emailConfirmation.confirmationCode': body.code }, // Фильтр для поиска нужного документа
            updateObject // Объект с изменениями
        );

        return resultCodeMap(true, null)
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