const jwt = require('jsonwebtoken');

const User = require('../models/user');

const AuthError = require('../utils/AuthError'); // importing the custom Error class made
const AppError = require('../utils/AppError'); // importing the custom Error class made

const maxAge = 3*24*60*60
const createToken = (id) => {
    return jwt.sign({id}, 'thisisagoodsecret', {
        expiresIn: maxAge //3 days in seconds
    })
}

//Get request method to register the user
module.exports.signup_get = (req, res, next) => {
    res.render('user/signup');
}

//Post request method to register the user
module.exports.signup_post = async(req, res, next) => {
    try {
    const {username, password} = req.body;
    const user = await new User({username, password});
    
    const token = createToken(user._id);
    res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
    
    await user.save();

    req.flash('success', 'Welcome to ReadIt!')
    res.redirect('/');    
    } catch(e) {
        const error = AuthError(e);
        req.flash('error', error);
        // req.flash('error', e.message);
        
        res.redirect('/signup');
    }
}

//Get request method to login the user
module.exports.login_get = async(req, res, next) => {
    res.render('user/login');
}

//Post request method to login the user
module.exports.login_post = async(req, res, next) => {
    try {
        const {username, password} = req.body;
        const foundUser = await User.findAndValidate(username, password);
        if(foundUser) {
            const token = createToken(foundUser._id);
            res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
          
            req.flash('success', 'Welcome back!');
            res.redirect('/');
        } else {
            req.flash('error', 'Incorrect username or password');
            res.redirect('/login');
        }
    } catch(e) {
        req.flash('error', 'You are not a registered user');
        res.redirect('/signup');
    }
}

//Get request method to logout the user
module.exports.logout = async(req, res, next) => {
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('/');
}

