import {randomUUID} from "crypto";

export class CommentClass {
    createdAt: string
    id: string

    constructor(
        public content: string,
        public commentatorInfo: {
            userId: string;
            userLogin: string;
        },
        public postId: string) {
        this.createdAt = new Date().toISOString()
        this.id = randomUUID()
    }
}