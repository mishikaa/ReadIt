// ----Self-contained file to seed our database-----

const mongoose = require('mongoose');
const Blog = require('../models/blog');
const blogs = require('./blogs');

// CONNECT MONGOOSE
mongoose.connect('mongodb://0.0.0.0:27017/readIt', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Checking for error
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("DATABASE CONNECTED!");
})

const seedDB = async() => {
    await Blog.deleteMany({});
    for(let i = 0; i < 2; i++) {
        const blog = new Blog(blogs[i]);
        await blog.save();
    }
}

seedDB();

// In order to load this file , enter the command: node seeds/index.js