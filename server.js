const express = require('express');
const app = express();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite')
const port = process.env.PORT || 4000;
const apiRouter = require('./api/api.js');
const bodyParser = require('body-parser');

//Use body-parser middleware to parse incoming JSON-formated requests
app.use(bodyParser.json());

//Pass all requests to /api to /api/api.js
app.use('/api', apiRouter);

//Start server on PORT
app.listen(port, ()=>{
  console.log('Express server running on port ' + port);
});

module.exports = app;
