const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Blog = require('../models/blog');
const Comment = require('../models/comment');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    // Check json web token exists and is verified
    if(token) {
        jwt.verify(token, 'thisisagoodsecret', (err, decodedToken) => {
            if(err) {
                req.flash('error', err.message);
                res.redirect('/login')
            } else {
                next();
            }
        });
    } else {
        req.flash('warning', 'You need to login first!');
        res.redirect('/login')
    }
}

// Check for current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token) {
        jwt.verify(token, 'thisisagoodsecret', async(err, decodedToken) => {
            if(err) {
                res.locals.currentUser = null;
                next();
            } else {
                // console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.currentUser = user;
                next();
            }
        });
    } else {
        res.locals.currentUser = null;
        next();
    }
}

// Middleware to check if the logged in user is the author of the blog or not
const isAuthor = async(req, res, next) => {
    const {id} = req.params;
    const blog = await Blog.findById(id);
    if(! blog.user.equals(res.locals.currentUser._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/blogs/${id}`);
    } else {
        next();
    }
}

// Middleware to check if the logged in user is the writer of the comment or not
const isCommentWriter = async(req, res, next) => {
    const {blogId, commentId} = req.params;
    const comment = await Comment.findById(commentId);
    if(! comment.user.equals(res.locals.currentUser._id)) {
        req.flash('error', 'You do not have permission to delete this comment!');
        res.redirect(`/blogs/${blogId}`);
    } else {
        next();
    }

}
module.exports = {requireAuth, checkUser, isAuthor, isCommentWriter};