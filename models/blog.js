const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Comment = require('../models/comment');

const blogSchema = new Schema({
    title: String,
    subtitle: String,
    coverImg: String,
    image: [String],
    tags: [String],
    content: String,
    date: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
})

// Deleting the comments associated with a blog
blogSchema.post('findOneAndDelete', async function(doc) {
    if(doc) {
        await Comment.remove({
            _id: {
                $in: doc.comments
            }
        })
    }
})
module.exports = mongoose.model('Blog', blogSchema);
