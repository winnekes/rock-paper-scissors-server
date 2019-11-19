const express = require('express');
const auth = require('../auth/middleware');

const Room = require('./model');
const User = require('../user/model');

const { Router } = express;

function factory(stream) {
    const router = new Router();

    router.post('/room', auth, (request, response, next) => {
        Room.create(request.body).then(room => {
            const data = JSON.stringify(room);
            stream.send(data);
            response.send(room);
        });
    });

    router.post('/room/join'),
        auth,
        (request, response, next) => {
            User.findByPk(req.params.eventId)
                .then(user => User.update(req.body))
                .then(user => res.send(user))
                .catch(err => next(err));

            console.log();
        };
    return router;
}

module.exports = factory;
