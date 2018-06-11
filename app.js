const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const routes = require('./server/routes/router');
const env = process.env.NODE_ENV || 'development';


const app = express();

app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env === 'development';

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + '/dist'));
app.disable('etag');
app.use('/', routes);
// error handlers

if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    console.log('error was caught in dev error handler');
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// production error handler no stacktraces leaked to user
app.use((err, req, res, next) => {
  console.log('must be prod err', err);
  console.log('error was caught in prod error handler');
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

module.exports = app;
