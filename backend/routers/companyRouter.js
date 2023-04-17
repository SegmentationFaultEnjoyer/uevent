const { Router } = require('express');

const companyRouter = Router();

const CompanyController = require('../controllers/handlers/companies');

companyRouter.route('/')
    .get(CompanyController.GetCompaniesList) 
    .post(CompanyController.CreateCompany)

companyRouter.route('/:id')
    .get(CompanyController.GetCompanyById)
    .delete(CompanyController.DeleteCompanyById)
    .patch(CompanyController.UpdateCompanyById) 

module.exports = companyRouter;