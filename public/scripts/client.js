/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const createTweetElement = function(tweet) {
  const $tweet = $("<article>").addClass("tweet");
  let html = `
    <header class="tweet-header">
      ${tweet.user.name}
      ${tweet.user.handle}
    </header>
    <div class="tweet-content">
      <p class="tweet-content">
        ${escape(tweet.content.text)}
      </p>
    </div>
    <footer class="tweet-footer">
      ${tweet.created_at} days ago
    </footer>
  `;
  $tweet.append(html);
  return $tweet;
};

const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

const renderTweets = function(tweets) {
  for (const tweet of tweets) {
    if (tweet.content.text === "") {
      alert("Tweet something");
    } else {
      $newTweet = createTweetElement(tweet);
      $('.tweets-container').append($newTweet);  
    }    
  }
};

const loadTweets = function() {
    $.ajax('./tweets', { method: 'GET' })
    .then(function(tweets) {
      console.log('Success: ');
      renderTweets(tweets);
    })
};

const toggleNewTweet = function(element) {
  element.click(() => {
    const $newTweet = $('.new-tweet');
    if ($newTweet.hasClass('hidden')) {
      $newTweet.slideDown('slow').toggleClass('hidden');
    } else {
      $newTweet.slideUp('slow').toggleClass('hidden');
    }
  });
};

const submitTweet = function() {
  $('#new-tweet-form').submit(function(event) {
    event.preventDefault();

    const $emptyError = $('#new-tweet-form > .empty-error');
    const $lengthError = $('#new-tweet-form > .length-error');
  
    let data = $(this).serialize()
    const text = data.split("=");
  
    if (text[1] === "") {
      $emptyError.slideDown('slow').toggleClass('hidden');
    } else if (text[1].length > 140) {
      $lengthError.slideDown('slow').toggleClass('hidden');
    } else {
      if (!($emptyError.hasClass('hidden'))) {
        $emptyError.slideUp('slow').toggleClass('hidden');
      }
      if (!($lengthError.hasClass('hidden'))) {
        $lengthError.slideUp('slow').toggleClass('hidden');
      }
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
};

$(document).ready(function() {
  submitTweet();
  loadTweets();
  toggleNewTweet($('nav > div'));
});