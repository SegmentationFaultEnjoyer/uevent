const { Router } = require('express');

const userRouter = Router();

const UserController = require('../controllers/handlers/users');

userRouter.route('/')
    .get(UserController.GetUsersList) 
    .post(UserController.CreateUser)

userRouter.route('/:address')
    .get(UserController.GetUserByAddress)
    .delete(UserController.DeleteUserByAddress)

userRouter.route('/:user_address/companies/company_id')
    .post(UserController.AddUser)
    .patch(UserController.UpdateRole)
    .delete(UserController.DeleteUserFromCompany)

module.exports = userRouter;