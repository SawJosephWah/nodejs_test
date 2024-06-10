const request = require("supertest");
const mongoose = require('mongoose');
const { model: RentalModal } = require('../../models/rental')
const moment = require('moment');
let app;

describe("Rental return tests", () => {

    let customerId = new mongoose.mongo.ObjectId();
    let movieId = new mongoose.mongo.ObjectId();
    let newRental;

    beforeAll(() => {
        app = require("../../index");
    });

    beforeEach(async () => {
        newRental = new RentalModal({
            customer: {
                _id: customerId,
                name: 'John Doe',
                isGold: true,
            },
            movie: {
                _id: movieId,
                name: 'Oppenhimier',
                dailyRentalRate: 50,
            },
        });
        await newRental.save();
    })

    it("Should return 400 if customer Id is not included in request ", async () => {
        let payload = {
            movie_id: customerId,
        }
        const response = await request(app)
            .post('/rentals/return')
            .send(payload)

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('Customer ID is required');
    });

    it("Should return 400 if movie Id is not included in request ", async () => {
        let payload = {
            customer_id: movieId,
        }
        const response = await request(app)
            .post('/rentals/return')
            .send(payload)

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('Movie ID is required');
    });

    it("Should return 400 if there is no rental data with customer Id from request ", async () => {
        let payload = {
            customer_id: new mongoose.mongo.ObjectId(),
            movie_id: movieId
        }
        const response = await request(app)
            .post('/rentals/return')
            .send(payload)

        expect(response.status).toBe(400);
        // expect(response.body.return).toBeTruthy();
    });

    it("Should return 400 if there is no rental data with movie Id from request ", async () => {
        let payload = {
            customer_id: customerId,
            movie_id: new mongoose.mongo.ObjectId()
        }
        const response = await request(app)
            .post('/rentals/return')
            .send(payload)

        expect(response.status).toBe(400);
        // expect(response.body.return).toBeTruthy();
    });

    it("Should return 200 if everything OK ", async () => {

        newRental.dateOut = moment().subtract(7, 'days').toDate();
        await newRental.save();


        let payload = {
            movie_id: movieId,
            customer_id: customerId,
        }
        const response = await request(app)
            .post('/rentals/return')
            .send(payload)

        const savedRental = await RentalModal.findOne({ 'customer._id': customerId, 'movie._id': movieId });

        expect(response.status).toBe(200);
        expect(response.body.return).toBeTruthy();


        // Check if dateOut is set to the current date (allow a small margin of error)
        const now = new Date();
        const returnDate = new Date(savedRental.returnDate);
        const timeDifference = Math.abs(now - returnDate);
        const maxAllowedDifference = 10000; // 10 seconds

        expect(timeDifference).toBeLessThan(maxAllowedDifference);

        // Check rentalFees
        const rentalFeesMustBe = newRental.movie.dailyRentalRate * 7;
        expect(savedRental.rentalFees).toBe(rentalFeesMustBe); // Ensure rentalFees is greater than 0

    });

    afterEach(async () => {
        await RentalModal.deleteMany();
    })

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        app.close();
        await mongoose.disconnect();
    });
});