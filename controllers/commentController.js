const Blog = require('../models/blog');
const Comment = require('../models/comment');

//Post request method to add a comment
module.exports.add = async(req, res, next) => {
    const {blogId} = req.params;
    const blog = await Blog.findById(blogId);
    const comment = await new Comment(req.body.comment);
    comment.user = res.locals.currentUser._id;
    blog.comments.push(comment);
    await comment.save();
    await blog.save();
    req.flash('success', 'Successfully added the comment!')
    res.redirect(`/blogs/${blog._id}`)
} 

//Delete request method to delete a comment
module.exports.delete = async(req, res, next) => {
    const{blogId, commentId} = req.params;
    await Blog.findByIdAndUpdate(blogId, {$pull: {comments: commentId}});
    await Comment.findByIdAndDelete(commentId);
    req.flash('success', 'Successfully deleted the comment!')
    res.redirect(`/blogs/${blogId}`);
}

//Put request method to edit a comment
module.exports.edit = async(req, res, next) => {
    const{blogId, commentId} = req.params;
    await Blog.findByIdAndUpdate(blogId, {$pull: {comments: commentId}});
    req.flash('success', 'Successfully updated comment!')
    res.redirect(`/blogs/${blogId}`);
}