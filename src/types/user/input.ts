export type SortUsersDataType = {
    searchLoginTerm?: string
    searchEmailTerm?: string
    sortBy?: string
    sortDirection?: 'asc' | 'desc'
    pageNumber?: number
    pageSize?: number
}

export interface UserInputModel {
    email: string
    password: string
    login: string
}

export interface CodeConfirmModel {
    code: string
}