const express = require("express");
const router = express.Router({mergeParams: true});

const catchAsync = require('../utils/catchAsync');

const { requireAuth, isCommentWriter } = require("../middleware/authMiddleware");

const comment = require('../controllers/commentController');

//----- ADDING A COMMENT -----
router.post('/', requireAuth, catchAsync(comment.add))

router.route('/:commentId')
    //----- DELETING A COMMENT -----
    .delete(requireAuth, isCommentWriter, catchAsync(comment.delete))
    
    //----- EDITING A COMMENT -----
    .put(requireAuth, isCommentWriter, catchAsync(comment.edit))

module.exports = router;