/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {
  const createTweetElement = function(tweet) {
    const $tweet = $("<article>").addClass("tweet");
    let html = `
      <header class="tweet-header">
        ${tweet.user.name}
        ${tweet.user.handle}
      </header>
      <div class="tweet-content">
        <p class="tweet-content">
          ${tweet.content.text}
        </p>
      </div>
      <footer class="tweet-footer">
        ${tweet.created_at} days ago
      </footer>
    `;
    $tweet.append(html);
    return $tweet;
  };

  const renderTweets = function(tweets) {
    for (const tweet of tweets) {
      $newTweet = createTweetElement(tweet);
      $(".tweets-container").append($newTweet);
    }
  };

  const loadTweets = function() {
    $(function() {
      $.ajax('./tweets', { method: 'GET' })
      .then(function(tweets) {
        console.log('Success: ');
        renderTweets(tweets);
      })
    });
  };

  loadTweets();

  // const data = [
  //   {
  //     "user": {
  //       "name": "Newton",
  //       "avatars": "https://i.imgur.com/73hZDYK.png"
  //       ,
  //       "handle": "@SirIsaac"
  //     },
  //     "content": {
  //       "text": "If I have seen further it is by standing on the shoulders of giants"
  //     },
  //     "created_at": 1461116232227
  //   },
  //   {
  //     "user": {
  //       "name": "Descartes",
  //       "avatars": "https://i.imgur.com/nlhLi3I.png",
  //       "handle": "@rd" },
  //     "content": {
  //       "text": "Je pense , donc je suis"
  //     },
  //     "created_at": 1461113959088
  //   }
  // ]
  
  // renderTweets(data)  
});
