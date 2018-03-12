'use strict';
var express = require('express');
var router = express.Router();
const models = require('../models');
const Page = models.Page;
const User = models.User;

router.get('/', (req, res, next) => {
  res.redirect('/');
});

router.post('/', function(req, res, next) {
  const page = Page.build({
    title: req.body.title,
    content: req.body.content
  });
  page.save()
    .then(data => {
      res.json(data);
    });
});

router.get('/add', function(req, res, next) {
  res.render('addPage');
});




module.exports = router;
