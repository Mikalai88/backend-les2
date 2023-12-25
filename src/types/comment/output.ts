
export interface CommentViewModel {
    id: string
    content: string
    commentatorInfo: {
        userId: string,
        userLogin: string
    }
    createdAt: string
}

export interface CommentDbModel {
    id: string
    content: string
    commentatorInfo: {
        userId: string,
        userLogin: string
    }
    createdAt: string
    postId: string
}