const { Router } = require('express');

const promocodeRouter = Router();

const PromocodeController = require('../controllers/handlers/promocodes');

promocodeRouter.route('/')
    .get(PromocodeController.GetPromocodesList) 
    .post(PromocodeController.CreatePromocode) 
    
promocodeRouter.route('/:code/validate')
    .get(PromocodeController.ValidatePromocodeByCode)

promocodeRouter.route('/:code/use')
    .get(PromocodeController.UpdatePromocodeById)

promocodeRouter.route('/:id')
    .get(PromocodeController.GetPromocodeById)
    .delete(PromocodeController.DeletePromocodeById)
    .patch(PromocodeController.UpdatePromocodeById) 

module.exports = promocodeRouter;