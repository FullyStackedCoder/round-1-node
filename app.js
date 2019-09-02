const path = require('path');
const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const config = require('./config');

const authRoutes = require('./routes/auth');
const resizeRoutes = require('./routes/resize');
const patchRoutes = require('./routes/patch');

const app = express();
const server = http.createServer(app);

// Don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Parse application/json and look for raw text
app.use(
  bodyParser.json({
    limit: config.bodyLimit,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, PUT, POST, DELETE, PATCH'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/image', resizeRoutes);
app.use('/api/v1/json', patchRoutes);

app.use((error, req, res, next) => {
  // console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    message: message,
    data: data,
  });
});

app.get('/', (req, res, next) => {
  res.send('REST Api is live!');
});

let port = process.env.PORT || 8080;

server.listen(port, config.host);
server.on('listening', function() {
  console.log('Express server started on port %s at %s', server.address().port,
    server.address().address);
});

module.exports = server;
