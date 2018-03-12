'use strict';
var express = require('express');
var router = express.Router();
var wikiRouter = require('./wiki');
var userRouter = require('./user');
//var client = require('../db/index');


router.get('/', (req, res, next) => {
  res.render('index');
});



router.use('/wiki', wikiRouter);
router.use('/user', userRouter);

module.exports = router;
