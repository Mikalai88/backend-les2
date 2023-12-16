import {OutputItemsPostType, PostType} from "./output";

export const postMapper = (post: PostType): OutputItemsPostType => {
    return {
        id: post.id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
    }
}