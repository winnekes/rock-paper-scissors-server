const express = require('express');
const auth = require('../auth/middleware');

const Room = require('./model');
const User = require('../user/model');

const { Router } = express;

function factory(stream) {
    const router = new Router();

    router.post('/room', auth, async (request, response, next) => {
        const room = await Room.create(request.body);

        const action = {
            type: 'ADD_ROOM',
            payload: room,
        };

        const string = JSON.stringify(action);
        stream.send(string);

        response.send(action);
    });

    router.get('/room/:roomName', auth, async (request, response, next) => {
        const room = await Room.findOne({
            include: [{ model: User }],
            where: { name: request.params.roomName },
        });

        const action = {
            type: 'SELECT_ROOM',
            payload: room,
        };
        const string = JSON.stringify(action);
        stream.send(string);

        response.send(room);
    });

    router.put('/join', auth, async (request, response, next) => {});
    router.get(
        '/room/:roomName/join',
        auth,
        async (request, response, next) => {
            const user = await User.findByPk(request.user.id);
            const room = await Room.findOne({
                include: [{ model: User }],
                where: { name: request.params.roomName },
            });

            const update = await user.update({ roomId: room.id });

            const rooms = await Room.findAll({
                include: [
                    {
                        model: User,
                    },
                ],
            });

            const updatedRoom = await Room.findOne({
                include: [{ model: User }],
                where: { name: request.params.roomName },
            });
            const actionJoin = {
                type: 'JOIN_ROOM',
                payload: room,
            };
            const actionSelect = {
                type: 'SELECT_ROOM',
                payload: updatedRoom,
            };
            const actionRooms = {
                type: 'SET_ROOMS',
                payload: rooms,
            };

            const stringJoin = JSON.stringify(actionJoin);
            stream.send(stringJoin);
            const stringRooms = JSON.stringify(actionRooms);
            stream.send(stringRooms);
            const stringSelect = JSON.stringify(actionSelect);
            stream.send(stringSelect);
            response.send(rooms);
        }
    );
    return router;
}

module.exports = factory;
