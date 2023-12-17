import bcrypt from 'bcrypt'
import {OutputItemsUserType, UserType} from "../types/user/output";
import {randomUUID} from "crypto";
import {UserRepository} from "../repositories/user-repository";

export const usersService = {
    async createUser(login: string, email: string, password: string): Promise<string | null> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)

        const newUser: UserType = {
            id: randomUUID(),
            userLogin: login,
            userEmail: email,
            passwordHash,
            createdAt: (new Date()).toISOString()
        }

        const result = await UserRepository.createUser(newUser)
        if (!result) {
            return null
        }
        return newUser.id

    },

    async findUserById(id: string): Promise<OutputItemsUserType | null> {
        return UserRepository.findUserById(id)
    },

    async deleteUser(id: string): Promise<boolean> {
        return UserRepository.deleteUser(id)
    },

    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await UserRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) return false
        const compaireResult = await bcrypt.compare(password, user.passwordHash)
        if (!compaireResult) {
            return null
        }
        return user
    },

    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash
    }
}