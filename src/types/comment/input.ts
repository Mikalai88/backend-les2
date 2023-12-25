import {CommentViewModel} from "./output";

export interface CommentPaginationViewModel {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: CommentViewModel[]
}