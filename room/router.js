const express = require('express');
const Sequelize = require('sequelize');
const op = Sequelize.Op;

const auth = require('../auth/middleware');

const Room = require('./model');
const User = require('../user/model');

const { Router } = express;

function factory(stream) {
    const includeUsersAndOrder = {
        include: [{ model: User }],

        order: [
            ['createdAt', 'ASC'],
            [{ model: User }, 'username', 'ASC'],
        ],
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
        const updatedUser = await user.update({
            roomId: room.id,
            turn: false,
            points: 0,
            choice: 'no choice',
        });
        const updatedRoom = await Room.findOne({
            where: { name },
            include: [{ model: User }],
        });
        if (updatedRoom.users.length === 1) {
            const updatedRoomStatus = await updatedRoom.update({
                status: 'waiting for one more player',
                winner: 'no winner',
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
        /* const user = await User.findByPk(request.user.id);
        const updatedUser = await user.update({ turn: true }); */

        const room = await Room.findOne({ where: { name } });

        const updatedRoomStatus = await room.update({
            status: 'running',
            winner: 'no winner',
        });

        const users = await User.findAll({ where: { roomId: room.id } });

        const updatedUsers = await Promise.all(
            users.map(async user => await user.update({ choice: 'no choice' }))
        );

        const rooms = await Room.findAll(includeUsersAndOrder);
        const string = JSON.stringify(actionCreator(rooms));
        stream.send(string);

        response.send(updatedRoomStatus);
    });
    router.put('/end/:name', auth, async (request, response) => {
        const { name } = request.params;

        const room = await Room.findOne({ where: { name } });
        const users = await User.findAll({ where: { roomId: room.id } });

        const updatedRoomStatus = await Room.destroy({ where: { name } });

        const updatedUsers = await Promise.all(
            users.map(
                async user =>
                    await user.update({
                        choice: 'no choice',
                        points: 0,
                        roomId: null,
                    })
            )
        );

        const rooms = await Room.findAll(includeUsersAndOrder);
        const string = JSON.stringify(actionCreator(rooms));
        stream.send(string);

        response.send(updatedRoomStatus);
    });

    router.put('/decideWinner/:name', auth, async (request, response, next) => {
        const { name } = request.params;

        const user = await User.findByPk(request.user.id);
        const updatedUser = await user.update(request.body);

        const room = await Room.findOne({ where: { name } });
        const users = await User.findAll({
            where: { roomId: room.id },
        });
        const user1 = user;
        const user2 = users.find(user => user.id !== user1.id);

        const ROCK = 'rock';
        const SCISSORS = 'scissors';
        const PAPER = 'paper';

        if (user1.choice !== 'no choice' && user2.choice !== 'no choice') {
            if (user1.choice === user2.choice) {
                updatedRoom = await room.update({
                    status: 'game is over',
                    winner: `oh, it's a tie!`,
                });
            } else {
                if (user1.choice === ROCK) {
                    if (user2.choice === SCISSORS) {
                        updatedRoom = await room.update({
                            status: 'game is over',
                            winner: user1.username,
                        });

                        const winnerGetsPoints = await user1.increment(
                            'points'
                        );
                    }
                } else {
                    updatedRoom = await room.update({
                        status: 'game is over',
                        winner: user2.username,
                    });

                    const winnerGetsPoints = await user2.increment('points');
                }
                if (user1.choice === SCISSORS) {
                    if (user2.choice === PAPER) {
                        updatedRoom = await room.update({
                            status: 'game is over',
                            winner: user1.username,
                        });

                        const winnerGetsPoints = await user1.increment(
                            'points'
                        );
                    }
                } else {
                    updatedRoom = await room.update({
                        status: 'game is over',
                        winner: user2.username,
                    });

                    const winnerGetsPoints = await user2.increment('points');
                    console.log(winnerGetsPoints);
                }
                if (user1.choice === PAPER) {
                    if (user2.choice !== SCISSORS) {
                        updatedRoom = await room.update({
                            status: 'game is over',
                            winner: user1.username,
                        });

                        const winnerGetsPoints = await user1.increment(
                            'points'
                        );
                        console.log(winnerGetsPoints);
                    }
                } else {
                    updatedRoom = await room.update({
                        status: 'game is over',
                        winner: user2.username,
                    });

                    const winnerGetsPoints = await user2.increment('points');
                    console.log(winnerGetsPoints);
                }
            }
        }
        console.log('user1', user1);
        console.log('user2', user2);

        const rooms = await Room.findAll(includeUsersAndOrder);
        const string = JSON.stringify(actionCreator(rooms));
        stream.send(string);

        response.send(updatedUser.choice);
    });

    router.put('/point', auth, async (request, response, next) => {
        const user = await User.findByPk(request.user.id);

        const updatedUser = await user.increment('points');

        const rooms = await Room.findAll(includeUsersAndOrder);
        const string = JSON.stringify(actionCreator(rooms));
        stream.send(string);

        response.send(updatedUser);
    });

    /*     router.put('/turn/:name', auth, async (request, response, next) => {
        const { name } = request.params;

        const room = await Room.findOne({
            where: { name },
        });
        const users = await User.findAll({
            where: { roomId: room.id },
        });

        const updatedUser = await Promise.all(
            users.map(async user =>
                user.turn
                    ? await user.update({ turn: false })
                    : await user.update({ turn: true })
            )
        );

        const rooms = await Room.findAll(includeUsersAndOrder);
        const string = JSON.stringify(actionCreator(rooms));
        stream.send(string);

        response.send(rooms);
    }); */

    return router;
}

module.exports = factory;
