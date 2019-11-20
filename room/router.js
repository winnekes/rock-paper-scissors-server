const express = require('express');
const auth = require('../auth/middleware');

const Room = require('./model');
const User = require('../user/model');

const { Router } = express;

function factory(stream) {
    const includeUsersAndOrder = {
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
        const rooms = await Room.findAll(includeUsersAndOrder);

        const string = JSON.stringify(actionCreator(rooms));
        stream.send(string);

        response.send(room);
    });

    router.put('/join/:name', auth, async (request, response) => {
        const { name } = request.params;

        const user = await User.findByPk(request.user.id);
        const room = await Room.findOne({
            where: { name },
            include: [{ model: User }],
        });
        const updatedUser = await user.update({ roomId: room.id });
        const updatedRoom = await Room.findOne({
            where: { name },
            include: [{ model: User }],
        });
        if (updatedRoom.users.length === 1) {
            const updatedRoomStatus = await updatedRoom.update({
                status: 'waiting for one more player',
            });
        } else if (updatedRoom.users.length === 2) {
            const updatedRoomStatus = await updatedRoom.update({
                status: 'ready to start',
            });
        }

        const rooms = await Room.findAll(includeUsersAndOrder);

        const string = JSON.stringify(actionCreator(rooms));
        stream.send(string);

        response.send(updatedUser);
    });

    router.put('/start/:name', auth, async (request, response) => {
        const { name } = request.params;

        const room = await Room.findOne({
            where: { name },
        });
        const updatedRoomStatu = await room.update({ status: 'running' });
        const rooms = await Room.findAll(includeUsersAndOrder);

        const string = JSON.stringify(actionCreator(rooms));
        stream.send(string);

        response.send(updatedRoomStatus);
    });

    router.put('/points/:userId', auth, async (request, response, next) => {
        const user = await User.findByPk(request.user.id);

        const updatedUser = await user.update({ points: 1 });

        const rooms = await Room.findAll(includeUsersAndOrder);

        const string = JSON.stringify(actionCreator(rooms));

        stream.send(string);

        response.send(updatedUser);
    });

    return router;
}

module.exports = factory;
