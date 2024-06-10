//course 
const mongoose = require('mongoose');
const { Schema } = mongoose;
require('./models/customer');

mongoose.connect('mongodb://127.0.0.1:27017/test')
    .then(() => console.log('Connected to database successfully'))
    .catch(err => err)

//course
const courseSchema = new mongoose.Schema({
    name: String,
    author: [{ type: Schema.Types.ObjectId, ref: 'Customer' }]
});

const Course = mongoose.model('Joseph', courseSchema);

// async function createCourse() {
//     const course = new Course({
//         name: 'Test',
//         author: ['662fc2c063d32e0c6ffb3477','662fc2c463d32e0c6ffb3479']
//     })

//     await course.save();

//     console.log('Saved successfully');
// }

// createCourse();

async function getAllCourses() {
    const courses = await Course.find().populate('author', 'name -_id');

    console.log(courses[0].author);
}

getAllCourses();