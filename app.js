var express = require('express');
var app = express();
var path = require('path');
var Twit = require('twit');
var config = require('./config.js');
var twit = new Twit(config);

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'pug');

twit.get('statuses/user_timeline', {screen_name: "treasureporth", count: 5}, function(err,data,res){
  var userInfo;
  var tweetList = [];
  var userList = [];
  var messageList = [];

  data.forEach(function(tweet){
    userInfo = {
      username : tweet.user.name,
      screenname : tweet.user.screen_name,
      profileImg : tweet.user.profile_image_url,
    }

    tweetList.push({
      text : tweet.text,
      favorite_count: tweet.favorite_count,
      retweet_count: tweet.retweet_count,
      createdAt: tweet.created_at
    });
  });

  twit.get('friends/list', {screen_name: "treasureporth", count: 5}, function(err,data,res){
    var users = data.users;
    users.forEach(function(user){
        userList.push({
          screenname: user.screen_name,
          name: user.name,
          img: user.profile_image_url,
          following: user.following
        });
    });
  });

  twit.get('direct_messages', {screen_name: "treasureporth", count: 5}, function(err,data,res){
    data.forEach(function(message){
      messageList.push({
        sender: message.sender.name,
        message: message.text,
        sender_screename: message.sender_screen_name
      });
    });
  });

  app.get('/', function(req,res,err){
    res.render('index', {
      title: "Super Duper Twitter App",
      tweetList: tweetList,
      userInfo: userInfo,
      userList: userList,
      messageList: messageList
    });
  });
});


app.listen(3000, function () {
  console.log('Witness the magic at localhost:3000!')
});
