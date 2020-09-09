
const express = require('express')
const urlParser = require('url');
// const {recordVisit} = require('./middleware');

const port = process.env.PORT || 8000;

const game = express();
// game.use(recordVisit());
game.use(express.static('./'));
console.log("server listening on port", port);

game.listen(port);
