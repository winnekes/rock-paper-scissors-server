const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Sse = require('json-sse');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 4000;

app.listen(port, () => console.log('listening on port: ', port));
