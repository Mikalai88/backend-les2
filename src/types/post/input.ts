export type PostParams = {id: string}

export type CreatePostInputModel = {
    title: string
    shortDescription: string
    content: string
    blogId: string
}

export type UpdatePostInputModel = {
    title: string
    shortDescription: string
    content: string
    blogId: string
}

export type SortPostsDataType = {
    sortBy?: string
    sortDirection?: 'asc' | 'desc'
    pageNumber?: number
    pageSize?: number
}