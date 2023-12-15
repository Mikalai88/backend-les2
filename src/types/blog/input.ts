export type BlogParams = {id: string}

export type CreateBlogInputModel = {
    name: string
    description: string
    websiteUrl: string
}

export type CreatePostForBlogInputModel = {
    title: string
    shortDescription: string
    content: string
}

export type UpdateBlogInputModel = {
    name: string
    description: string
    websiteUrl: string
}

export type SortBlogsDataType = {
    searchNameTerm?: string
    sortBy?: string
    sortDirection?: 'asc' | 'desc'
    pageNumber?: number
    pageSize?: number
}