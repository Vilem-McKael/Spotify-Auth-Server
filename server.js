var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var axios = require('axios');
var cors = require('cors');

require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { URLSearchParams } = require('url');

var app = express();
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
app.use('/spotify', require('./routes/auth'))

app.get('/refresh', async (request, response) => {
  const code = request.query['code']
  await axios
  .post(
    (url = 'https://accounts.spotify.com/api/token'),
    (data = new URLSearchParams({
      grant_type: 'authorization_code',
      redirect_uri: process.env.REDIRECT_URI,
      code: code,
    })),
    (config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params: {
        grant_type: 'client-credentials',
      },
      auth: {
        username: process.env.CLIENT_ID,
        password: process.env.CLIENT_SECRET,
      },
    })
  ).then(resp1 => {
    axios
    .post(
      (url = 'https://accounts.spotify.com/api/token'),
      (data = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: resp1.data.refresh_token,
        access_token: resp1.data.access_token,
      })),
      (config = {
        auth: {
          username: process.env.CLIENT_ID,
          password: process.env.CLIENT_SECRET,
        },
      })
    )
    .then(resp2 => {
      return this.response.send(JSON.stringify([resp1.data, resp2.data]))
    })
  })
})

// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const port = process.env.PORT

app.listen(port, function () {
  console.log(`Express app running on port ${port}`)
});

// module.exports = app;
