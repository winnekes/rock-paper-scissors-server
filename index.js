const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Sse = require('json-sse');

const db = require('./db');
const userRouter = require('./user/router');
const authRouter = require('./auth/router');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(userRouter);
app.use(authRouter);

const port = process.env.PORT;

app.listen(port, () => console.log('listening on port: ', port));
