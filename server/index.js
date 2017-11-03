const cluster = require('cluster');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const PORT = process.env.PORT || 3000;

if (cluster.isMaster) {
  const numCPUs = require('os').cpus().length;

  console.log(`Master ${process.pid} is running`);
  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  const app = express();

  app.use(morgan('tiny'));
  app.use(bodyParser.json());

  console.log(`Worker ${process.pid} started`);
  app.post('/tweets', function (req, res) {
    console.log(req.body);
    console.log(`Process ${process.pid} is working...`);
    res.end();
  });
  
  app.listen(PORT, function () {
    console.log(`${process.pid} is listening on port ${PORT}!`);
  });
}

