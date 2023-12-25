import {OutputItemsBlogType} from "../src/types/blog/output";

const request = require('supertest')
import {app} from "../src/settings";
import {OutputItemsUserType, OutputUserType} from "../src/types/user/output";

describe('/users', () => {
    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data').expect(204)
    })

    it('GET users = []', async () => {
        const data = {
            login: "admin",
            email: "admin@mail.com",
            password: "1234567"
        }
        let newUser = await request(app)
            .post('/users')
            .auth('admin', 'qwerty')
            .send(data)

        expect(newUser.status).toBe(201)

        expect(newUser.body).toEqual({
            id: expect.any(String),
            login: expect.stringContaining(data.login),
            email: expect.stringContaining(data.email),
            createdAt: expect.any(String)
        })

        const res = await request(app).get('/users')
            .auth('admin', 'qwerty')
        expect(res.body).toEqual({ pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [newUser.body] })
    })

})