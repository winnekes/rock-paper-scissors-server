const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Sse = require('json-sse');

const app = express();

const { PORT } = require('./constants');

const port = process.env.PORT || PORT;

app.listen(port, () => console.log('listening on port: ', port));
