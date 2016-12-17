$(function() {
  var fileSelector = function (id) {
    return "#file-" + id.replace(/(:|\.|\[|\]|,|=)/g, "\\$1");
  };

  $('.preview-swap').each(function () {
    $(this).html($(this).next().html());
  });

  $('.iterations-nav-item').hover(function() {
    var solution = $(this).data('solution');
    var files = Object.values(solution);

    files.forEach(function(file, index) {
      var code = $('<code class="scroll-x" />').text(file).html();
      $('#file-' + index).html('<pre class="prettyprint linenums">' +
        code + '</pre>');
    });
    prettyPrint();
  }, function() {
    $('.preview-swap').each(function () {
      $(this).next().html($(this).html());
    });

  });
});
