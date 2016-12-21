(function () {
  "use strict";

  $(function() {

    var activeSolution,
        $activeTab,
        $codeBlockCache,
        $codeBlocks,
        $codeCache,
        diffCodeBlock,
        findAdjacentTab,
        highlightCodeBlock,
        $iterationsNavItemInactive,
        normalizeTrack,
        restoreCodeBlocks,
        $submission,
        toggleDiffView;
    

    $submission = $('#submission');
    $codeBlocks = $('.submission-code-body td.code');
    $activeTab = $('.iterations-nav-item.active');
    activeSolution = $activeTab.data('solution');

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

    normalizeTrack = function (track) {
      var hljsNames = {
        'csharp': 'cs',
        'objective-c': 'objectivec',
        'perl5': 'perl'
      };
      return hljsNames[track] || track;
    };

    // Highlight the code and cache a copy of the highlighted block for quickly
    // restoring the view after a diff or preview of another iteration
    $codeCache = $('<div id="code-cache" class="hidden">').appendTo($('#current_submission'));
    $codeBlocks.each(function (index, block) {
      var language = normalizeTrack($('#file-' + index).data('track'));
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
        // When there are more two iterations, allow selecting which iteration
        // to diff against by hovering over the inactive tabs
        if (!$(this).hasClass('diff-view-old')) {
          $iterationsNavItemInactive.removeClass('diff-view-old');
          $(this).data('solution').forEach(diffCodeBlock);
          $(this).addClass('diff-view-old');
        }
      } else {
        // Allow previews of the other iterations by hovering over their tabs
        $(this).data('solution').forEach(highlightCodeBlock);
      }
    }, function() {
      if (!$submission.hasClass('diff-view')) {
        restoreCodeBlocks();
      }
    });

    // Only enable diff button when there is more than 1 iteration
    if ($iterationsNavItemInactive.length > 0) {
      $('.btn-show-diff')
      .removeClass('disabled')
      .on('click', function(e) {
        e.preventDefault();
        toggleDiffView();
      });
    }

    toggleDiffView = function () {
      if ($submission.hasClass('diff-view')) {
        $iterationsNavItemInactive.removeClass('diff-view-old');
        restoreCodeBlocks();
      } else {
        findAdjacentTab()
        .addClass('diff-view-old')
        .data('solution').forEach(diffCodeBlock);
      }
      $submission.toggleClass('diff-view');
    };

    // When the diff button is clicked, try to diff the active tab against
    // the previous iteration. If the active tab is the first iteration, then
    // diff against the second iteration.
    findAdjacentTab = function () {
      var otherTab = $activeTab.prev('.iterations-nav-item');
      if (otherTab.length < 1) {
        otherTab = $activeTab.next('.iterations-nav-item');
      }
      return otherTab;
    };
  });
})();
