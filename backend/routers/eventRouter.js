const { Router } = require('express');

const eventRouter = Router();

const EventController = require('../controllers/handlers/events');
const CommentController = require('../controllers/handlers/comments');

eventRouter.route('/')
    .get(EventController.GetEventsList) 
    .post(EventController.CreateEvent) 

eventRouter.route('/banner')
    .get(EventController.GenerateBanner)

eventRouter.route('/categories')
    .get(EventController.GetCategoriesList)

eventRouter.route('/:id')
    .get(EventController.GetEventById)
    .delete(EventController.DeleteEventById)
    .patch(EventController.UpdateEventById) 

eventRouter.route('/:event_id/comments')
    .post(CommentController.CreateComment)



module.exports = eventRouter;