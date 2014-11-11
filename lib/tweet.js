var Twit = require('twit')
var T = new Twit({
    consumer_key:         '2u3aE8dfCFm6GJvUq0jbEtjVJ'
  , consumer_secret:      'yTMfvAF7qFRx5Y4mIgNF2rNlBlelzCjwdyqfbmWIMGtBPpybq9'
  , access_token:         '6193422-fSsCBftkmgGaiZEiAfxZ7XDTwq2UHR4ypND2VLAwqi'
  , access_token_secret:  'f87vmR2auKf5RW6f6AHicEIexi307Ff9OgqZANGqQ209g'
})


var getUserProfile = function(screen_name, callback) {

  T.get('users/show', { screen_name: screen_name }, function(err, data, response) {
    console.log(err,data);
    if (!err) {
      var obj = {
        name: data.name,
        location: data.location,
        description: data.description,
        url: data.url,
        followers: data.followers_count,
        friends: data.friends_count,
        pic: data.profile_image_url
      }
    }

    callback(err, obj);
    //console.log(err,data)
  })
}


module.exports = {
  getUserProfile: getUserProfile
}