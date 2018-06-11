
const path = require('path');
const express = require('express');
const router = express.Router();

router.get('*', (req, res, next) => {
  const defaultroute = path.join(__dirname, '..', '..', 'dist', 'index.html');
  console.log('the default route is ', defaultroute);
  res.sendFile(path.join(defaultroute));
});

console.log('public router');
module.exports = router;

