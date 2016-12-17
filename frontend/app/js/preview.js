$(function() {
  $('.preview-swap').each(function () {
    $(this).html($(this).next().html());
  });

  $('.iterations-nav-item').hover(function() {
    if (!$(this).hasClass('active')) {
      var solution = $(this).data('solution');
      var files = Object.values(solution);

      files.forEach(function(file, index) {
        var code = $('<code />').text(file).html();
        $('#file-' + index).html('<pre class="prettyprint linenums">' +
            code + '</pre>');
      });
      PR.prettyPrint();
    }
  }, function() {
    if (!$(this).hasClass('active')) {
      $('.preview-swap').each(function () {
        $(this).next().html($(this).html());
      });

    }
  });
});
