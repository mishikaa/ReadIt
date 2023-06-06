if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const path = require('path');

const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const basicRoutes = require('./routes/basic');
const blogRoutes = require('./routes/blogs');
const commentRoutes = require('./routes/comments');

const methodOverride = require('method-override');
const flash = require('connect-flash');
const ejsMate = require('ejs-mate');

const AppError = require('./utils/AppError'); // importing the custom Error class made
const { checkUser } = require('./middleware/authMiddleware');

// CONNECT MONGOOSE
mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


// Checking for error
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("DATABASE CONNECTED!");
})

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true})); //parsing the req.body
app.use(express.static(path.join(__dirname, 'public'))); //setting the public directory

app.use(methodOverride('_method'));

const sessionConfig = {
    name: 'sess',
    secret: 'thisismysecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        //cookie can't be accessed through a client-side script
        httpOnly: true,
        //secure: true
        // Date.now() is in ms, if we want it to expire in week, then:
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7) ,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(cookieParser());

app.engine('ejs', ejsMate);


// Middleware to flash the messages
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.warning = req.flash('warning');
    res.locals.error = req.flash('error');
    next();
})

app.use('*', checkUser);

//----- AUTHENTICATION ROUTES -----
app.use('/', authRoutes);

//----- BASIC ROUTES -----
app.use('/', basicRoutes);

//----- BLOGS ROUTES -----
app.use('/blogs', blogRoutes);

//----- COMMENTS ROUTES -----
app.use('/blogs/:blogId/comments', commentRoutes);


// This will execute only when none of the above routes matches
app.all('*', (req, res, next) => {
    next(new AppError(404, 'Page Not Found!'))
})

// Error handling middleware
app.use((err, req, res, next) => {
    const {statusCode = 500, message = "Something went wrong!"} = err;
    res.status(statusCode).render('error', {statusCode, message});
})

app.listen(process.env.PORT, ()=> {
    console.log(`LISTENING ON PORT ${process.env.PORT}`)
})


