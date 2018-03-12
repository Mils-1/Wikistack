'use strict';
const express = require('express');
const app = express();
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const routes = require('./routes');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const models = require('./models');
//const pg = require('pg');
//require sequelize

// templating boilerplate setup

app.use(express.static(path.join(__dirname, '/public')));
app.use('/', routes);

app.engine('html', nunjucks.render);
app.set('view engine', 'html');
nunjucks.configure('views', { noCache: true });

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

models.db.sync({force: true})
  .then(function () {
    console.log('All tables created!');
    app.listen(1337, function(){
      console.log('listening on port 1337');
    });
  })
  .catch(console.error.bind(console));

