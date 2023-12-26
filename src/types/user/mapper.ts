import {BlogType, OutputItemsBlogType} from "../blog/output";
import {OutputItemsUserType, UserType} from "./output";

export const userMapper = (user: UserType): OutputItemsUserType => {
    return {
        id: user.id,
        login: user.userLogin,
        email: user.emailConfirmation.userEmail,
        createdAt: user.createdAt
    }
}