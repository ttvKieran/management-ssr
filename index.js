const express = require('express');
const app = express();
const port = 3000;

const route = require('./routes/client/index.route');

app.use(express.static('public'));

app.set('views', './views');
app.set('view engine', 'pug');

require('dotenv').config();

const database = require('./configs/database');
database.connect();

route(app);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});