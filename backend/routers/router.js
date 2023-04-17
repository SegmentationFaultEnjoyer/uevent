const { Router } = require('express');
const router = Router();

const fileUpload = require('express-fileupload');

const userRouter = require('./userRouter');
const eventRouter = require('./eventRouter');
const companyRouter = require('./companyRouter');
const commentRouter = require('./commentRouter');
const promocodeRouter = require('./promocodeRouter');

const { join } = require('path');

router.use(fileUpload())

router.use('/users', userRouter);

router.use('/companies', companyRouter);

router.use('/comments', commentRouter);

router.use('/promocodes', promocodeRouter);

router.use('/events', eventRouter);

router.get('/images/:type/:image_name', (req, resp) => {
    const { image_name, type } = req.params;

    resp.sendFile(join(__dirname, '..', 'user_data', type, image_name));
})

module.exports = router;