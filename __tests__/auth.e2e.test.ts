import {emailAdapter} from "../src/adapters/email-adapter";

const request = require('supertest')
import {app} from "../src/settings";
import {userCollection} from "../src/db/db";


describe('/auth', () => {
    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data').expect(204)
    })

    beforeEach(async () => {
        jest.spyOn(emailAdapter, "sendEmail").mockImplementation(() => Promise.resolve(true))
    })

    it('AUTH registration', async () => {
        const result = await request(app)
            .post('/auth/registration')
            .send({
                login: "Nikolaj",
                email: "mikalai.mikhalachkin@gmail.com",
                password: "123456789"
            })

        expect(result.status).toBe(204)
    })

    it('AUTH resending', async () => {
        const result  = await request(app)
            .post('/auth/registration-email-resending')
            .send({
                email: "mikalai.mikhalachkin@gmail.com"
            })

        expect(result.status).toBe(204)
    })

    it('AUTH confirmation', async () => {
        const user = await userCollection.findOne({'emailConfirmation.email': "mikalai.mikhalachkin@gmail.com"})
        if (!user) {
            return
        }
        const code = user.emailConfirmation.confirmationCode

        const result  = await request(app)
            .post('/auth/registration-confirmation')
            .send({
            code: code
        })

        expect(result.status).toBe(204)
    })

})