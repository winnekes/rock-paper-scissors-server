const express = require('express');
const auth = require('../auth/middleware');

const Room = require('./model');

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
    return router;
}

module.exports = factory;
