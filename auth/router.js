const express = require('express');
const bcrypt = require('bcrypt');
const { toJWT, toData } = require('./jwt');
const { Router } = express;
const auth = require('./middleware');

const User = require('../user/model');

const router = new Router();

router.post('/login', (req, res, next) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(entity => {
            if (!entity) {
                res.status(400).send({
                    message: 'User with that email does not exist'
                });
            } else if (bcrypt.compareSync(req.body.password, entity.password)) {
                res.send({
                    jwt: toJWT({ userId: entity.id })
                });
            } else {
                res.status(400).send({
                    message: 'Password was incorrect'
                });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({
                message: 'Something went wrong'
            });
        });
});

router.get('/secret-endpoint', auth, (req, res) => {
    res.send({
        message: `Thanks for visiting the secret endpoint ${req.user.email}.`
    });
});
module.exports = router;
