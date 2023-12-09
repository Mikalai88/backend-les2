import {OutputBlogType} from "../src/types/blog/output";

const request = require('supertest')
import {app} from "../src/settings";

describe('/blogs', () => {
    let newBlog: OutputBlogType | null = null

    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data').expect(204)
    })

    it('GET blogs = []', async () => {
        await request(app).get('/blogs').expect([])
    })

    it('- POST does not create the blog with incorrect data (no name, no description, no websiteUrl)', async () => {
        const result = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send({name: '', description: '', websiteUrl: ''})

        expect(result.status).toBe(400)
        expect(result.body).toEqual({
            errorsMessages: [
                {message: expect.any(String), field: 'name'},
                {message: expect.any(String), field: 'description'},
                {message: expect.any(String), field: 'websiteUrl'}
            ]
        })

        const res = await request(app).get('/blogs')
        expect(res.body).toEqual([])
    })

    it('- GET blog by ID with incorrect id', async () => {
        await request(app).get('/blogs/helloWorld').expect(404)
    })

    it('+ POST blog with correct data', async () => {
        const data = {
            name: 'New Blog Name',
            description: "That's a new blog.",
            websiteUrl: 'https://newblog.com'
        }
        const res = await request(app)
            .post('/blogs')
            .auth('admin', "qwerty")
            .send(data)
            .expect(201)

        newBlog = res.body

        expect(data.name).toEqual(res.body.name)
    })

    it('+ GET blog by ID with correct id', async () => {
        await request(app)
            .get('/blogs/' + newBlog!.id)
            .expect(200, newBlog)
    })

    it('- PUT blog by ID with incorrect id and data', async () => {
        await request(app)
            .put('/blogs/' + -100)
            .auth('admin', 'qwerty')
            .send({name: '', description: '', websiteUrl: ''})
            .expect(400)
        const res = await request(app).get('/blogs')
        expect(res.body[0]).toEqual(newBlog)
    })

    it('+ PUT blog by ID with correct id and data', async () => {
        await request(app)
            .put('/blogs/' + newBlog!.id)
            .auth('admin', 'qwerty')
            .send({
                name: 'New Blog Name2',
                description: "That's a new blog2.",
                websiteUrl: 'https://newblog2.com'
            })
            .expect(204)
        const res = await request(app).get('/blogs')
        expect(res.body[0]).toEqual({
            ...newBlog,
            name: 'New Blog Name2',
            description: "That's a new blog2.",
            websiteUrl: 'https://newblog2.com'
        })
        newBlog = res.body[0]
    })

    it('- DELETE blog by incorrect ID', async () => {
        await request(app)
            .delete('/blogs/098765432')
            .auth('admin', 'qwerty')
            .expect(404)

        const res = await request(app).get('/blogs')
        expect(res.body[0]).toEqual(newBlog)
    })

    it('+ DELETE blog by correct ID, auth', async () => {
        await request(app)
            .delete('/blogs/' + newBlog!.id)
            .auth('admin', 'qwerty')
            .expect(204)

        const res = await request(app).get('/blogs')
        expect(res.body.length).toBe(0)
    })
})