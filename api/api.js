const express = require('express');
const apiRouter = express.Router();
const employeeRouter = require('./employees.js');

//Pass all requests to /api/employees to employees.js
apiRouter.use('/employees', employeeRouter);

module.exports = apiRouter;
