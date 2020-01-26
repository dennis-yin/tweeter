const getCharsRemaining = function () {
  const tweetBox = $("#tweet-box");
  const counter = $("#counter");

  tweetBox.on("input", () => {
    counter.text(140 - tweetBox.val().length);

    counter.css({
      color: function () {
        if (counter.text() < "0") {
          return "red";
        } else {
          return "#545159";
        }
      }
    });
  });
};

$(document).ready(() => {
  getCharsRemaining();
});