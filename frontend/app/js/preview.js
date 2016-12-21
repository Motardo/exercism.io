(function () {
  "use strict";

  $(function() {

    var activeSolution,
        $activeTab,
        $codeBlockCache,
        $codeBlocks,
        $codeCache,
        diffCodeBlock,
        highlightCodeBlock,
        $iterationsNavItemInactive,
        restoreCodeBlocks,
        $submission;
    

    $submission = $('#submission');
    $activeTab = $('.iterations-nav-item.active');
    activeSolution = $activeTab.data('solution');
    $codeBlocks = $('.submission-code-body td.code');

    highlightCodeBlock = function(file, index) {
      var codeBlock = $codeBlocks.eq(index).find('code');
      codeBlock.text(file[1]);
      hljs.highlightBlock(codeBlock[0]);
    };

    diffCodeBlock = function(file, index) {
      var diff, wikEdDiff;
      wikEdDiff = new WikEdDiff();
      diff = wikEdDiff.diff(file[1], activeSolution[index][1]);
      $codeBlocks.eq(index).html(diff);
    };

    restoreCodeBlocks = function () {
      $codeBlocks.each(function (index) {
        $(this).html($codeBlockCache.eq(index).html());
      });
    };

    $codeCache = $('<div id="code-cache" class="hidden">').appendTo($('#current_submission'));
    $codeBlocks.each(function (index, block) {
      var language = $('#file-' + index).data('track');
      $(this).html('<pre><code class="lang-' + language + '">');
      $(this).addClass('lang-' + language);
      $(this).find('code').text(activeSolution[index][1]);
      hljs.highlightBlock($(this)[0]);
      $(this).clone().appendTo($codeCache);
    });
    $codeBlockCache = $('#code-cache td');

    $iterationsNavItemInactive = $('.iterations-nav-item:not(.active)');

    $iterationsNavItemInactive.hover(function() {
      if ($submission.hasClass('diff-view')) {
        if (!$(this).hasClass('diff-view-old')) {
          $iterationsNavItemInactive.removeClass('diff-view-old');
          $(this).data('solution').forEach(diffCodeBlock);
          $(this).addClass('diff-view-old');
        }
      } else {
        $(this).data('solution').forEach(highlightCodeBlock);
      }
    }, function() {
      if (!$submission.hasClass('diff-view')) {
        restoreCodeBlocks();
      }
    });

    if ($iterationsNavItemInactive.length > 0) {
      $('.btn-show-diff')
      .removeClass('disabled')
      .on('click', function(e) {
        e.preventDefault();
        if ($submission.hasClass('diff-view')) {
          $iterationsNavItemInactive.removeClass('diff-view-old');
          restoreCodeBlocks();
        } else {
          var otherTab = $activeTab.prev('.iterations-nav-item');
          if (otherTab.length < 1) {
            otherTab = $activeTab.next('.iterations-nav-item');
          }
          otherTab.data('solution').forEach(diffCodeBlock);
          otherTab.addClass('diff-view-old');
        }
        $submission.toggleClass('diff-view');
      });
    }
  });
})();
