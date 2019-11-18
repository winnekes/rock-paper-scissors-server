const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Sse = require('json-sse');

const db = require('./db');
const userRouter = require('./user/router');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(userRouter);

const port = process.env.PORT || 4000;

app.listen(port, () => console.log('listening on port: ', port));
