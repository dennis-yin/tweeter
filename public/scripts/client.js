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
      if (tweet.content.text === "") {
        alert("Tweet something");
      } else {
        $newTweet = createTweetElement(tweet);
        $(".tweets-container").append($newTweet);  
      }    
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

  $("#new-tweet-form").submit(function(event) {
    event.preventDefault();
    let data = $(this).serialize()
    const text = data.split("=");
    if (text[1] === "") {
      alert("Enter a tweet");
    } else if (text[1].length > 140) {
      alert("Tweet is too long");
    } else {
      $.ajax({
        url: "./tweets",
        type: "POST",
        data: data,
        success: function() {
          loadTweets();
        },
      })
    }
  })
});

// module.exports = { createTweetElement, renderTweets, loadTweets };
