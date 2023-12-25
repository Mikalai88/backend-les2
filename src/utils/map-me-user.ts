import {OutputItemsUserType} from "../types/user/output";
//
// export interface AdminDbModel {
//     id: string
//     email: string
//     password: string
//     login: string
//     createdAt: string
//     code?: string
//     exp?: Date
// }

export interface MeViewModel {
    email: string
    login: string
    userId: string
}

export const mapAuthUser = (user: OutputItemsUserType): MeViewModel => {
    return {
        email: user.email,
        login: user.login,
        userId: user.id
    }
}