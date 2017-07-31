'use strict';


const path = require('path');
const express = require('express');
const router = express.Router();

/* routes for client app */
router.get('/', (req, res, next) => {
  res.sendFile(path.join(
    __dirname, '..', '..', 'client', 'index.html'));
});

module.exports = router;

