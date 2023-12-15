import {WithId} from "mongodb";
import {OutputItemsPostType, PostType} from "./output";

export const postMapper = (post: WithId<PostType>): OutputItemsPostType => {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
    }
}