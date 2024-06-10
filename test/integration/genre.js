let server = require('../../index');
// let server = null;
const request = require('supertest');
let mongoose = require('mongoose');
let { model } = require('../../models/genres')
const db = require('../../startup/db')

describe('Genre', () => {
    beforeAll(async () => {
        db();
        await model.deleteMany();
    })

    describe('GET', () => {
        test('GET MANY /', async () => {

            await model.insertMany([
                { name: 'genre1' },
                { name: 'genre2' },
                { name: 'genre3' }
            ]);

            const response = await request(server)
                .get('/genres');

            let test = response.body;

            expect(test.length).toBe(3);

        });

        test('GET SINGLE WITH ID /', async () => {
            await model.create({ name: 'genre1' });
            const createdGenre = await model.find();

            const objectId = getClearObjectId(createdGenre[0]._id);

            const response = await request(server)
                .get(`/genres/${objectId}`);

            const responseBody = response.body;

            expect(responseBody.name).toMatch('genre1');
            expect(responseBody._id).toMatch(objectId);

        });

        test('GET SINGLE WITH ID - NOT FOUND /', async () => {
            const response = await request(server)
                .get(`/genres/111111111111111111111111`);

            const responseText = response.text;

            expect(response.status).toBe(404);
            expect(responseText).toMatch('Do not found');

        });

        test('GET SINGLE WITH ID - Object ID Error /', async () => {
            const response = await request(server)
                .get(`/genres/sdfasdf`);

            expect(response.status).toBe(404);
            expect(response.text).toContain("Invalid ObjectId");

        });

    });

    const exec = async () => {
        return await request(server)
            .post('/genres')
            .send(payload)
            .set('Content-Type', 'application/json')
    }
    describe('POST', () => {
        test('POST /', async () => {
            const payload = { name: 'genre1' };
            const response = await request(server)
                .post('/genres')
                .send(payload)
                .set('Content-Type', 'application/json')

            let test = response.body;

            expect(test.name).toMatch('genre1');
            expect(response.status).toBe(200);

        });

        test('POST / - with validation error with no name property', async () => {
            const response = await request(server)
                .post('/genres')
                .set('Content-Type', 'application/json')

            let test = response.body;

            expect(test.length).toBe(1);
            expect(response.status).toBe(422);

        });

        test('POST / - with validation error with minimun length (5)', async () => {
            const payload = { name: 'genr' };
            const response = await request(server)
                .post('/genres')
                .send(payload)
                .set('Content-Type', 'application/json')

            let test = response.body;

            expect(test.length).toBe(1);
            expect(response.status).toBe(422);

        });

        test('POST / - with validation error with maximun length (255)', async () => {
            const payload = { name: '1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111' };
            const response = await request(server)
                .post('/genres')
                .send(payload)
                .set('Content-Type', 'application/json')

            let test = response.body;

            expect(test.length).toBe(1);
            expect(response.status).toBe(422);

        });
    });





    afterAll(async () => {
        mongoose.connection.close();
        server.close();
    })

    afterEach(async () => {
        await model.deleteMany();
    })
});

const getClearObjectId = (complexObjectId) => {
    return complexObjectId.toString().replace('ObjectId("', '').replace('")', '');
}

