$(function() {
  $('.preview-swap').each(function () {
    $(this).html($(this).next().html());
  });

  $('.iterations-nav-item').hover(function() {
    if (!$(this).hasClass('active')) {
      var solution = $(this).data('solution');
      var files = Object.values(solution);

      files.forEach(function(file, index) {
        var currentText = $('#submission-code-' + index).text();
        var differ = new WikEdDiff();
        var diffHtml = differ.diff(file, currentText);
        $('#file-' + index + ' .code').html(diffHtml);
      });
    }
  }, function() {
    if (!$(this).hasClass('active')) {
      $('.preview-swap').each(function () {
        $(this).next().html($(this).html());
      });

    }
  });
});
