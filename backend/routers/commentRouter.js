const { Router } = require('express');

const commentRouter = Router();

const CommentController = require('../controllers/handlers/comments');

commentRouter.route('/')
    .get(CommentController.GetCommentsList) 

commentRouter.route('/:id')
    .get(CommentController.GetCommentById)
    .delete(CommentController.DeleteCommentById)
    .patch(CommentController.UpdateCommentById) 

module.exports = commentRouter;