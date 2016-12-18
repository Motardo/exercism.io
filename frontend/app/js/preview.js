$(function() {
  $('.preview-swap').each(function () {
    var index = $(this).data('index');
    var rougeBlock = $('#file-' + index + ' td.code pre');
    rougeBlock.html('<code class="code-block-hljs" id="code-block-' + index + '" />');
    var codeBlock = $('#code-block-' + index);
    codeBlock.text($('#submission-code-' + index).text());
    codeBlock.each(function (i, block) {
      hljs.highlightBlock(block);
    });
    $(this).html(codeBlock.html());
  });

  $('.iterations-nav-item').hover(function() {
    if (!$(this).hasClass('active')) {
      var files = $(this).data('solution');

      files.forEach(function(file, index) {
       // var currentText = $('#submission-code-' + index).text();
        var codeBlock = $('#code-block-' + index);
        codeBlock.text(file[1]);
        codeBlock.each(function(i,b) {
          hljs.highlightBlock(b);
        });
       // var differ = new WikEdDiff();
       // var diffHtml = differ.diff(file[1], currentText);
       // $('#file-' + index + ' .code').html(diffHtml);
      });
    }
  }, function() {
    if (!$(this).hasClass('active')) {
      $('.preview-swap').each(function () {
        var index = $(this).data('index');
        var codeBlock = $('#code-block-' + index);
        codeBlock.html($(this).html());
      });
    }
  });
});
