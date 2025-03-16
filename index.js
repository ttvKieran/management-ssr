const express = require('express');
const database = require('./configs/database');
const systemConfig = require('./configs/system');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const flash = require('express-flash'); 
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const moment = require('moment');

const app = express();
const port = 3000;

require('dotenv').config();

const route = require('./routes/client/index.route');
const routeAdmin = require('./routes/admin/index.route');

app.use(express.static('public'));

app.use(methodOverride('_method'));

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// Express flash
app.use(cookieParser('MUAXUANDENBINHYEN'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// End Express flash

app.set('views', './views');
app.set('view engine', 'pug');

//Local variable
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

database.connect();

route(app);
routeAdmin(app);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});