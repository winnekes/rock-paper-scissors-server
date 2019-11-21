const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Sse = require('json-sse');

const stream = new Sse();

const userRouter = require('./user/router');
const roomFactory = require('./room/router');
const roomRouter = roomFactory(stream);

const Room = require('./room/model');
const User = require('./user/model');

const db = require('./db');
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(roomRouter);
app.use(userRouter);

app.get('/stream', async (request, response) => {
    const rooms = await Room.findAll({
        include: [{ model: User }],

        order: [
            ['createdAt', 'ASC'],
            [{ model: User }, 'username', 'ASC'],
        ],
    });
    const action = { type: 'SET_ROOMS', payload: rooms };

    const string = JSON.stringify(action);
    stream.updateInit(string);
    stream.init(request, response);
});

const port = process.env.PORT;

app.listen(port, () => console.log('listening on port: ', port));
