'use strict';
var express = require('express');
var router = express.Router();
//var client = require('../db/index');

router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;
