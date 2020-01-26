const calculateTweetCreation = function (time) {
  time /= 1000; // Convert milliseconds to seconds

  if (time < 60) {
    return "Less than a minute ago";
  }
  if (time < 3600) {
    return Math.floor(time / 60) + " minutes ago";
  }
  if (time < 86400) {
    return Math.floor(time / 3600) + " hours ago";
  }
  if (time < 2592000) {
    return Math.floor(time / 86400) + " days ago";
  }
  if (time < 31104000) {
    return Math.floor(time / 2592000) + " months ago";
  }
  return Math.floor(time / 31104000) + " years ago";
};

const createTweetElement = function (tweet) {
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

// Function to prevent XSS attacks
const escape = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const renderTweets = function (tweets) {
  $(".tweet-container").empty();
  for (const tweet of tweets) {
    $newTweet = createTweetElement(tweet);
    $(".tweet-container").prepend($newTweet);
  }
};

const loadTweets = function (cb) {
  $.ajax("/tweets", {
    method: "GET"
  }).then(function (tweets) {
    cb(tweets);
  });
};

// Toggle to hide/show the new tweet form
const toggleNewTweet = function (element) {
  element.click(() => {
    const $newTweet = $(".new-tweet");
    if ($newTweet.hasClass("hidden")) {
      $newTweet
        .slideDown("fast", () => {
          $newTweet.find("textarea").focus();
        })
        .toggleClass("hidden");
    } else {
      $newTweet.slideUp("fast").toggleClass("hidden");
    }
  });
};

const submitTweet = function () {
  $("#new-tweet-form").submit(function (event) {
    event.preventDefault();

    const $data = $(this).serialize();
    const $userTextInput = $(this).find("textarea");
    const $emptyError = $(this).find(".empty-error");
    const $lengthError = $(this).find(".length-error");

    // Control behaviour of error message(s)
    if ($emptyError.is(":hidden")) {
      if ($userTextInput.val() === "") {
        $emptyError.slideDown("slow").toggleClass("hidden");
        return;
      }
    } else {
      if ($userTextInput.val() !== "") {
        $emptyError.slideUp("slow").toggleClass("hidden");
      }
    }

    if ($lengthError.is(":hidden")) {
      if ($userTextInput.val().length > 140) {
        $lengthError.slideDown("slow").toggleClass("hidden");
        return;
      }
    } else {
      if ($userTextInput.val().length <= 140) {
        $lengthError.slideUp("slow").toggleClass("hidden");
      } else {
        return;
      }
    }

    $.ajax({
      url: "/tweets",
      type: "POST",
      data: $data,
      success: function () {
        loadTweets(renderTweets);
        $userTextInput.val(""); // Reset new tweet form
        $(".counter").text("140"); // Reset character counter
      }
    });
  });
};

$(document).ready(function () {
  submitTweet();
  loadTweets(renderTweets);
  toggleNewTweet($(".write-tweet"));
});