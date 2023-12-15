import {blogMapper} from "./mapper";

export type OutputItemsBlogType = {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

export type OutputBlogType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: OutputItemsBlogType[]
}

export type BlogType = {
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}