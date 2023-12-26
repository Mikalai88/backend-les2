import bcrypt from 'bcrypt'
import {OutputItemsUserType, UserType} from "../types/user/output";
import {randomUUID} from "crypto";
import {UserRepository} from "../repositories/user-repository";
import {EmailConfirmationClass} from "../classes/email-confirmation-class";
import {ResultCodeHandler, resultCodeMap} from "./comment-service";
import {CodeConfirmModel} from "../types/user/input";
import {add} from "date-fns";
import {v4 as uuidv4} from 'uuid';
import {EmailResending} from "../types/email";
import {emailAdapter} from "../adapters/email-adapter";
import {body} from "express-validator";

export const usersService = {
    async createUser(login: string, email: string, password: string): Promise<string | null> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)

        const newUser: UserType = {
            id: randomUUID(),
            userLogin: login,
            passwordHash,
            createdAt: (new Date()).toISOString(),
            emailConfirmation: new EmailConfirmationClass(email)
        }

        const result = await UserRepository.createUser(newUser)
        if (!result) {
            return null
        }

        const code = newUser.emailConfirmation.confirmationCode
        const resultSendEmail = await emailAdapter.sendEmail(email, code)
        if (!resultSendEmail) {
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

    async confirmUser(body: CodeConfirmModel): Promise<ResultCodeHandler<null>> {
        return await UserRepository.confirmUser(body)
    },

    async emailResending(body: EmailResending): Promise<ResultCodeHandler<null>> {
        const findConfirmationData = await UserRepository.findUserEmail(body)

        if (!findConfirmationData) {
            return resultCodeMap(false, null, "Not_Found")
        }
        if (findConfirmationData.isConfirmed) {
            return resultCodeMap(false, null, "Is_Confirmed")
        }
        const newConfirmationData = {
            ...findConfirmationData,
            expirationDate: add(new Date(), {
                minutes: 5
            }),
            confirmationCode: uuidv4()
        }
        const result = await UserRepository.resendingEmail(newConfirmationData)

        if (!result) return resultCodeMap(false, null, "Error_Server")

        try {
            await emailAdapter.sendEmail(findConfirmationData.userEmail, newConfirmationData.confirmationCode)
        } catch (e) {
            return resultCodeMap(false, null, "Error_Server")
        }
        return resultCodeMap(true, null)
    },

    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await UserRepository.findByLoginOrEmail(loginOrEmail)
        console.log("USER AUTH", user)
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