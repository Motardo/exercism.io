$(function() {

  var restoreCodeBlocks = function () {
    $('.preview-swap').each(function () {
      var index = $(this).data('index');
      var codeBlock = $('#code-block-' + index);
      codeBlock.html($(this).html());
    });
  };

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

  var iterationsNavItemInactive = $('.iterations-nav-item:not(.active)');

  iterationsNavItemInactive.hover(function() {
    var files = $(this).data('solution');

    files.forEach(function(file, index) {
      var codeBlock = $('#code-block-' + index);
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
      var linenums = $('.submission-code-body pre.lineno a');
      if ($(this).hasClass('active')) {
        iterationsNavItemInactive.removeClass('diffed-old');
        activeTab.removeClass('diffed-new');
        linenums.css('color', '#999999');
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
          var diffElem = $.parseHTML(diff);
          // remove the outer <pre> tag
          var preInnerHtml = $(diffElem).find('pre').html();
          $('#code-block-' + index).html(preInnerHtml);
        });
        otherTab.addClass('diffed-old');
        activeTab.addClass('diffed-new');
        linenums.css('color', '#f84');
      }
      $('.btn-show-diff').toggleClass('active');
    });
  }
});
