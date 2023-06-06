const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync')

const { requireAuth, isAuthor } = require('../middleware/authMiddleware');

// Importing the controllers
const blogs = require('../controllers/blogsContoller') ;

const multer = require('multer')
const upload = multer({ dest: 'uploads/'})

router.route('/')
    //----- DISPLAYING ALL BLOGS -----
    .get(requireAuth, catchAsync(blogs.index))
    
    //Post Route for creating new blog
    .post(requireAuth, catchAsync(blogs.create_post))


//----- CREATING A NEW BLOG -----
//Get Route for creating new blog
router.get('/write', requireAuth, catchAsync(blogs.create_get))

router.get('/search', requireAuth, catchAsync(blogs.search))

router.route('/:id')
    //----- DISPLAYING A BLOG -----
    .get(requireAuth, catchAsync(blogs.display))
    
    //Put request for editing the blog
    .put(requireAuth, isAuthor, catchAsync(blogs.edit_post))
    
    //----- DELETING A BLOG -----
    .delete(requireAuth, isAuthor, catchAsync(blogs.delete))


//----- EDITING A BLOG -----

router.get('/:id/edit', requireAuth, isAuthor, catchAsync(blogs.edit_get))


module.exports = router;