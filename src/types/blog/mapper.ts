import {WithId} from "mongodb";
import {BlogType, OutputItemsBlogType} from "./output";

export const blogMapper = (blog: BlogType): OutputItemsBlogType => {
    return {
        id: blog.id,
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership
    }
}