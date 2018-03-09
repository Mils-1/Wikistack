'use strict';
var express = require('express');
var router = express.Router();
var tweetBank = require('../tweetBank');
var client = require('../db/index');

module.exports = function makeRouterWithSockets(io) {

  // a reusable function
  function respondWithAllTweets(req, res, next) {
    client.query(`'SELECT * FROM tweets JOIN users ON tweets.user_id = users.id'`, function(err, result) {
      if (err) return next(err); // pass errors to Express
      var allTweets = result.rows;
      res.render('index', {
         title: 'Twitter.js',
         tweets: allTweets,
         showForm: true });
    });
  }

  // here we basically treet the root view and tweets view as identical
  router.get('/', respondWithAllTweets);
  router.get('/tweets', respondWithAllTweets);

  // single-user page
  router.get('/users/:username', function(req, res, next) {
    client.query(`'SELECT * FROM users JOIN tweets ON user_id = users.id WHERE name = $1'`, [req.params.username], function(err, result) {
      if (err) return next(err); // pass errors to Express
      var tweetsForName = result.rows;
      res.render('index', {
        title: 'Twitter.js',
        tweets: tweetsForName,
        showForm: true,
        username: req.params.username
      });
    });
  });

  // single-tweet page
  router.get('/tweets/:id', function(req, res, next) {
    client.query(`SELECT * FROM tweets, users WHERE user_id = users.id AND tweets.id = $1`, [req.params.id], function(err, result) {
      if (err) return next(err); // pass errors to Express
      var tweetsForID = result.rows;
      res.render('index', {
        title: 'Twitter.js',
        tweets: tweetsForID
      });
    });
  });

  // create a new tweet
  router.post('/tweets', function(req, res, next){
    function insertTweet (userId) {
      client.query('INSERT INTO tweets (content, user_id) VALUES ($1, $2)', [req.body.content, userId], function (err, data) {
        if (err) {
          next(err);
        } else {
          // io.sockets.emit('new_tweet', newTweet);
          res.redirect('/');
        }
      });
    }
    client.query('SELECT id FROM users WHERE name = $1', [req.body.name], function (err, data) {
      if (err) {
        next(err);
      } else {
        var foundUser = data.rows[0];
        if (!foundUser) {
          client.query('INSERT INTO users (name) VALUES ($1) RETURNING *', [req.body.name], function (err, data) {
            if (err) {
              next(err);
            } else {
              var insertedUser = data.rows[0];
              insertTweet(insertedUser.id);
            }
          });
        } else {
          insertTweet(foundUser.id);
        }
      }
    });
  });

  // // replaced this hard-coded route with general static routing in app.js
  // router.get('/stylesheets/style.css', function(req, res, next){
  //   res.sendFile('/stylesheets/style.css', { root: __dirname + '/../public/' });
  // });

  return router;
}
