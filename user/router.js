// Now setup a user/router file. It should only define the POST /user endpoint. In your top-level index.js, require the user/router as userRouter and add it to your app using .use(userRouter).

const express = require('express');
const bcrypt = require('bcrypt');

const { Router } = express;
const User = require('./model');

const router = new Router();

router.post('/user', (req, res, next) => {
    const user = {
        email: req.body.email,
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 10),
    };
    User.create(user)
        .then(user => res.send(user))
        .catch(err => next(err));
});

module.exports = router;
