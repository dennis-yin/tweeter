/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const calculateTweetCreation = function(time) {
  time /= 1000;  // Convert milliseconds to seconds

  if (time < 60) {
    return 'Less than a minute ago';
  }
  if (time < 3600) {
    return Math.floor(time / 60) + ' minutes ago';
  }
  if (time < 86400) {
    return Math.floor(time / 3600) + ' hours ago';
  }
  if (time < 2592000) {
    return Math.floor(time / 86400) + ' days ago';
  }
  if (time < 31104000) {
    return Math.floor(time / 2592000) + ' months ago';
  }
  return Math.floor(time / 31104000) + ' years ago';
};

const createTweetElement = function(tweet) {
  const currDate = Date.now();
  const dateCreated = new Date(tweet.created_at).getTime();
  const dateDiff = currDate - dateCreated;

  const $tweet = $(`
  <article class="tweet">
    <header class="tweet-header">
      <img src=${tweet.user.avatars}>
      <p class="username">${tweet.user.name}</p>
      <p class="handle">${tweet.user.handle}</p>
    </header>
    <p class="tweet-content">
      ${escape(tweet.content.text)}
    </p>
    <footer class="tweet-footer">
      <p class="date-created">${calculateTweetCreation(dateDiff)}</p>
      <figure class="flag">⚑</figure>
      <figure class="retweet">⟲</figure>
      <figure class="heart">❤</figure>
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
    const $userTextInput = $(this).find('textarea');
    const $emptyError = $(this).parent().find('.empty-error')
    const $lengthError = $(this).find('.length-error');
  
    console.log($emptyError.is(':hidden'))
    if ($emptyError.is(':hidden')) {
      console.log("YEAH")
      if ($userTextInput.val() === '') { 
        console.log("UH HUH")
        $emptyError.slideDown('slow').toggleClass('hidden');
        return;
      }
    }

    if ($lengthError.is(':hidden')) {
      if ($userTextInput.val().length > 140) {
        $lengthError.slideDown('slow').toggleClass('hidden');
        return;
      }
    }

    $.ajax({
      url: "/tweets",
      type: "POST",
      data: $data,
      success: function() {
        loadTweets(renderTweets);
        $userTextInput.val('');
        $('.counter').text('140');
        $('.tweet-container').html(``);
      }
    });
  });
};

$(document).ready(function() {
  submitTweet();
  loadTweets(renderTweets);
  toggleNewTweet($('.write-tweet'));
});