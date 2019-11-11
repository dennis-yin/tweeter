/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const createTweetElement = function(tweet) {
  const $tweet = $(`
  <article class="tweet">
    <header class="tweet-header">
      <p>${tweet.user.name}</p>
      <p>${tweet.user.handle}</p>
    </header>

    <p class="tweet-content">
      ${escape(tweet.content.text)}
    </p>

    <footer class="tweet-footer">
      <p>${tweet.created_at} days ago</p>
    </footer>
  `);

  return $tweet;
};

const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const renderTweets = function(tweets) {
  for (const tweet of tweets) {
    $newTweet = createTweetElement(tweet);
    $('.tweet-container').prepend($newTweet); 
  }
};

const loadTweets = function(cb) {
  $.ajax('/tweets', { method: 'GET' })
    .then(function(tweets) {
      cb(tweets);
    })
};

const toggleNewTweet = function(element) {
  element.click(() => {
    const $newTweet = $('.new-tweet');
    if ($newTweet.hasClass('hidden')) {
      $newTweet.slideDown('fast').toggleClass('hidden');
    } else {
      $newTweet.slideUp('fast').toggleClass('hidden');
    }
  });
};

const submitTweet = function() {
  $('#new-tweet-form').submit(function(event) {
    event.preventDefault();

    const $data = $(this).serialize();
    const $userTextInput = $(this).children('text');
    const $emptyError = $(this).children('empty-error')
    const $lengthError = $(this).children('length-error');
  
    if ($userTextInput === '') { 
      $emptyError.slideDown('slow').toggleClass('hidden');
      return;
    }

    if ($userTextInput.length > 140) {
      $lengthError.slideDown('slow').toggleClass('hidden');
      return;
    }

    $.ajax({
      url: "/tweets",
      type: "POST",
      data: $data,
      success: function() {
        $userTextInput.val('');
        $('.counter').text('140');
        $('.tweet-container').html(``);
        loadTweets(renderTweets);
      }
    });
  });
};

$(document).ready(function() {
  submitTweet();
  loadTweets(renderTweets);
  toggleNewTweet($('.nav > div'));
});