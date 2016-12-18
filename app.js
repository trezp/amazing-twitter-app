var express = require('express');
var app = express();
var Twit = require('twit');
var config = require('./config.js');
var twit = new Twit(config);

app.set('view engine', 'pug');

twit.get('statuses/user_timeline', {screen_name: "treasureporth", count: 5}, function(err,data,res){
  var tweetList = [];
  var userList = [];
  var messageList = [];

  data.forEach(function(tweet){
    tweetList.push(tweet.text);
  });

  twit.get('friends/list', {screen_name: "treasureporth", count: 5}, function(err,data,res){
    var users = data.users;

    users.forEach(function(user){
        userList.push(user.name);
    });
  });

  twit.get('direct_messages', {screen_name: "treasureporth", count: 5}, function(err,data,res){
    data.forEach(function(message){
      messageList.push(message.text);
    });
  });

  app.get('/', function(req,res,err){
    res.render('index', {title: "Super Duper Twitter App", tweetList: tweetList, userList: userList, messageList: messageList})
  });
});


app.listen(3000, function () {
  console.log('Witness the magic at localhost:3000!')
});
