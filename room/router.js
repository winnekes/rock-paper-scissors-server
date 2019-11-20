const express = require('express');
const auth = require('../auth/middleware');

const Room = require('./model');
const User = require('../user/model');

const { Router } = express;

function factory(stream) {
    const include = {
        include: [{ model: User }],
        order: [['createdAt', 'ASC']],
    };

    const actionCreator = rooms => ({
        type: 'SET_ROOMS',
        payload: rooms,
    });

    const router = new Router();

    router.post('/room', auth, async (request, response) => {
        const room = await Room.create(request.body);
        const rooms = await Room.findAll(include);

        const string = JSON.stringify(actionCreator(rooms));
        stream.send(string);

        response.send(room);
    });

    router.put('/join/:name', auth, async (request, response) => {
        const { name } = request.params;

        const user = await User.findByPk(request.user.id);
        const room = await Room.findOne({
            where: { name },
        });

        const updatedUser = await user.update({ roomId: room.id });
        const rooms = await Room.findAll(include);

        const string = JSON.stringify(actionCreator(rooms));
        stream.send(string);

        response.send(updatedUser);
    });

    router.put('/start/:name', auth, async (request, response) => {
        const { name } = request.params;

        const room = await Room.findOne({
            where: { name },
        });
        const updatedRoom = await room.update({ status: 'running' });
        const rooms = await Room.findAll(include);

        const string = JSON.stringify(actionCreator(rooms));
        stream.send(string);

        response.send(updatedRoom);
    });

    return router;
}

module.exports = factory;
