const express = require('express');
const bcrypt = require('bcrypt');
const { toJWT, toData } = require('../auth/jwt');
const auth = require('../auth/middleware');
const { Router } = express;
const User = require('./model');

const router = new Router();

router.post('/user', (req, res, next) => {
    const user = {
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 10),
    };
    User.create(user)
        .then(user => res.send(user))
        .catch(err => {
            console.error(err);
            res.status(400).send({
                message:
                    'A user with this username already exists, try again with another name',
            });
        });
});

router.post('/login', (req, res, next) => {
    User.findOne({
        where: {
            username: req.body.username,
        },
    })
        .then(entity => {
            if (!entity) {
                res.status(400).send({
                    message: 'User with that name does not exist',
                });
            } else if (bcrypt.compareSync(req.body.password, entity.password)) {
                res.send({
                    jwt: toJWT({ userId: entity.id }),
                });
            } else {
                res.status(400).send({
                    message: 'Password was incorrect',
                });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({
                message: 'Something went wrong',
            });
        });
});
module.exports = router;
