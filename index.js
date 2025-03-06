const express = require('express');
const app = express();
const port = 3000;

const route = require('./routes/client/index.route');
const routeAdmin = require('./routes/admin/index.route');

app.use(express.static('public'));

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', './views');
app.set('view engine', 'pug');

require('dotenv').config();

const systemConfig = require('./configs/system');
//Local variable
app.locals.prefixAdmin = systemConfig.prefixAdmin;

const database = require('./configs/database');
database.connect();

route(app);
routeAdmin(app);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});