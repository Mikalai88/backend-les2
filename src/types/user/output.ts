import {EmailConfirmationModel} from "../email";

export type OutputItemsUserType = {
    id: string
    login: string
    email: string
    createdAt: string
}

export type OutputUserType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: OutputItemsUserType[]
}

export type UserType = {
    id: string
    userLogin: string
    passwordHash: string
    createdAt: string
    emailConfirmation: EmailConfirmationModel
}