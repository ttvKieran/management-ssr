const express = require('express');
const database = require('./configs/database');
const systemConfig = require('./configs/system');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const route = require('./routes/client/index.route');
const routeAdmin = require('./routes/admin/index.route');

app.use(express.static('public'));

app.use(methodOverride('_method'));

app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', './views');
app.set('view engine', 'pug');

require('dotenv').config();

//Local variable
app.locals.prefixAdmin = systemConfig.prefixAdmin;

database.connect();

route(app);
routeAdmin(app);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});