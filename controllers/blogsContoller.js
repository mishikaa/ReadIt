// MVC: MODEL VIEW CONTROLLER FRAMEWORK
const Blog = require('../models/blog');

const AppError = require('../utils/AppError'); // importing the custom Error class made

//Method to display all blogs
module.exports.index = async(req, res, next) => {
    const blogs = await Blog.find({}).populate('user');
    res.render('blogs/index', {blogs});
}

//Get request method for creating new blog
module.exports.create_get = async(req, res, next) => {
    res.render('blogs/write');
}

//Post request method for creating new blog
module.exports.create_post = async(req,res) => {
    // res.send(req.body);
    if(!req.body.blog) {
        throw new AppError(400, "Cannot post an empty blog")
    }
    const {title, coverImg, content, tags} = req.body.blog;
    const blog = new Blog({title, coverImg, content, tags});
    blog.user = res.locals.currentUser._id; //Storing the current user id in the user attribute of blog

    await blog.save();
    req.flash('success', 'Successfully created the new blog!')
    res.redirect(`/blogs/${blog._id}`);
}

//Method displaying a blog
module.exports.display = async(req, res, next) => {
    const {id} = req.params;
    const blog = await Blog.findById(id).populate({
        path:'comments', //populate all the comments from the comments array
        populate: {
            path: 'user' //populate on each one of them their user(author)
        }
    }).populate('user'); //populate the one author of the specified blog
    // console.log(blog)
    if(!blog) {
        req.flash('error', 'Blog not found!')
        return next(new AppError(404, "Blog not found"))
    }
    res.render('blogs/show', {blog});
}

//Get request method to edit a blog
module.exports.edit_get = async(req, res, next) => {
    const {id} = req.params;
    const blog = await Blog.findById(id);
    if(!blog) {
        req.flash('error', 'Blog not found!')
        return next(new AppError(404, "Blog not found!"));
    }
    res.render('blogs/edit' ,{blog});
}

//Post request method to edit a blog
module.exports.edit_post = async(req, res, next) => {
    const blog = await Blog.findByIdAndUpdate(req.params.id, {...req.body.blog});
    req.flash('success', 'Successfully updated the blog!')
    res.redirect(`/blogs/${blog._id}`);
}

//Delete request method deleting a blog
module.exports.delete = async(req, res, next) => {
    const{id} = req.params;
    await Blog.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the blog!')
    res.redirect('/blogs');
}

//Get request method to search 
module.exports.search = async(req, res, next) => {
    const query = req.query.search ? {
        // if a req.query.search exists, then either the username or email matches the string in query(pattern matching)
        $or : [
            {tags: {$regex: req.query.search, $options: "i"}},
            {content: {$regex: req.query.search, $options: "i"}},
        ]
    } : {}
    // Find all the users having the string as per the query.search in their email or username except the user that is currently logged in
    const blogs = await Blog.find(keyword)
    res.send(blogs)
}