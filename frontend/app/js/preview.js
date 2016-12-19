$(function() {

  var restoreCodeBlocks = function () {
    $('.preview-swap').each(function () {
      var index = $(this).data('index');
      var codeBlock = $('#file-' + index + ' td.code');
      codeBlock.html($(this).html());
    });
  };

  $('.preview-swap').each(function () {
    var index = $(this).data('index');
    var codeBlock = $('#file-' + index + ' td.code');
    var text = $('#submission-code-' + index).text();
    codeBlock.html('<pre><code>' + text);
    codeBlock.each(function (i, block) {
      hljs.highlightBlock(block);
    });
    $(this).html(codeBlock.html());
  });

  var iterationsNavItemInactive = $('.iterations-nav-item:not(.active)');

  iterationsNavItemInactive.hover(function() {
    var files = $(this).data('solution');

    files.forEach(function(file, index) {
      var codeBlock = $('#file-' + index + ' td.code > pre > code');
      codeBlock.text(file[1]);
      codeBlock.each(function(i,b) {
        hljs.highlightBlock(b);
      });
    });
  }, function() {
    restoreCodeBlocks();
  });

  if (iterationsNavItemInactive.length > 0) {
    var btnShowDiff = $('.btn-show-diff');

    btnShowDiff.removeClass('hidden');
    btnShowDiff.on('click', function(e) {
      e.preventDefault();
      var activeTab = $('.iterations-nav-item.active');
      if ($('#submission').hasClass('diffed')) {
        iterationsNavItemInactive.removeClass('diffed-old');
        restoreCodeBlocks();
      } else {
        var otherTab = activeTab.prev('.iterations-nav-item');
        if (otherTab.length < 1) {
          otherTab = activeTab.next('.iterations-nav-item');
        }
        var otherSolution = otherTab.data('solution');
        otherSolution.forEach(function(file, index) {
          var currentText = $('#submission-code-' + index).text();
          var wikEdDiff = new WikEdDiff();
          var diff = wikEdDiff.diff(file[1], currentText);
          $('#file-' + index + ' td.code').html(diff);
        });
        otherTab.addClass('diffed-old');
      }
      $('#submission').toggleClass('diffed');
    });
  }
});
