const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('tiny'));
app.use(bodyParser.json());

app.post('/tweets', function (req, res) {
  console.log(req.body);
  res.end();
});

app.listen(PORT, function () {
  console.log(`App is listening on port ${PORT}!`);
});