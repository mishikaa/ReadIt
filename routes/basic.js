// BASIC ROUTES

const express = require('express');
const router = express.Router();

//----- HOMEPAGE -----

router.get('/', (req,res) => {
    res.render('home')
})

//----- PROFILE -----

router.get('/profile', (req, res, next) => {
    res.render('user/profile');
})

//----- ABOUT -----

router.get('/about', (req, res, next) => {
    res.render('website/about');
})

//----- CONTACT -----

router.get('/contact', (req, res, next) => {
    res.render('website/contact');
})

//----- REGISTER & LOGIN -----

router.get('/signup', (req, res, next) => {
    res.render('user/signup');
})

router.get('/login', (req, res, next) => {
    res.render('user/login');
})

module.exports = router;