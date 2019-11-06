$(document).ready(function() {
  $(".new-tweet textarea").keypress(function() {
    const $counter = $(this).parent().find('.counter');
    $counter.text(140 - $(this).val().length - 1);
    $counter.css({
      color: function() {
        if ($counter.text() < "0") {
          return "red";
        }
      }
    });
  });
});