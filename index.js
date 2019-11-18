const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Sse = require('json-sse');

const stream = new Sse();
const roomFactory = require('./room/router');
const roomRouter = roomFactory(stream);
const userRouter = require('./user/router');

const app = express();
const db = require('./db');

app.use(cors());
app.use(bodyParser.json());

app.use(roomRouter);
app.use(userRouter);

app.get('/stream', (req, res) => {
    stream.init(req, res);
});

const port = process.env.PORT;

app.listen(port, () => console.log('listening on port: ', port));
