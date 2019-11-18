const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Sse = require('json-sse');

const app = express();

const { PORT } = require('./constants');

app.listen(PORT, () => console.log('listening on port: ', PORT));
