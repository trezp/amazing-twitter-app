const express = require('express');
const router = express.Router();
const Twit = require('twit');
const config = require('./config.js');
const twit = new Twit(config);

router.get('/', (req,res,err) => {
  twit.get('account/verify_credentials', { skip_status: true })
    .catch(function (err) {
      console.log('caught error', err.stack)
    })
    .then(function (response) {
      return twit.get('statuses/user_timeline', {screen_name: response.data.screen_name, count: 5});
    })
    .then((response) => {
      req.timeline = [];

      response.data.forEach((item) => {
        req.timeline.push({
          image: item.user.profile_image_url,
          tweet: item.text,
          name: item.user.name,
          screenname: item.user.screen_name,
          created: item.user.created_at
        });
      });
      return twit.get('followers/list', {screen_name: response.data.screen_name, count: 5});
    })
    .then((response) => {
      req.followers = [];
      response.data.users.forEach((follower) => {
        req.followers.push({
          image: follower.profile_image_url,
          name: follower.name,
          screenname: follower.screen_name,
        });
      });
      return twit.get('direct_messages', {screen_name: response.data.screen_name, count: 5});
    })
    .then((response) => {
       req.direct_messages = [];
       response.data.forEach((sender) => {
         req.direct_messages.push({
           img: sender.sender.profile_image_url,
           message: sender.text
         });
       });
    })
    .then((response) =>{
      res.render('index', {
        timeline: req.timeline,
        followers: req.followers,
        direct_messages: req.direct_messages
      })
    })
});

module.exports = router;
