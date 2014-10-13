// configure marked for all pages
var renderer = new marked.Renderer();
renderer.code = function(code, lang) {
  var ret = '<div class="row"><div class="col-md-8 col-sm-12"><pre class="prettyprint language-' + lang + '">';
  ret += '<code>' + code.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</code>';
  ret += '</pre></div></div>';
  return ret;
};
marked.setOptions({
  renderer: renderer,
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: false,
  smartLists: true
});

$(document).ready(function() {
  prettyPrint();

  if(location.pathname == '/'){
    $('#navbar').addClass('hidden');
  }

  var interval = setInterval(arrowDownAnimation, 1000);

  $('#navbar').find('a').each(function() {
    if ($(this).attr('href') === location.pathname) {
      $(this).parent().addClass('active');
    }
  });

  var $backtotop = $('#backtotop');
  $backtotop.click(function() {
    $('body,html').animate({
      scrollTop: 0
    });
  });
  $(window).scroll(function() {
    var windowHeight = $(window).scrollTop();

    if (location.pathname == '/') {
      if (windowHeight > 0) {
        clearInterval(interval);
        $('#down-animate').hide();
        $('#down').hide();
      } else {
        interval = setInterval(arrowDownAnimation, 1000);
        $('#down-animate').show();
        $('#down').show();
      }
      windowHeight >= 1000 ? $('#navbar').removeClass('hidden') : $('#navbar').addClass('hidden');
    }
    windowHeight > 200 ? $backtotop.fadeIn() : $backtotop.fadeOut();
  });
  $('#down').click(function() {
    $('body,html').animate({
      scrollTop: 1000
    }, 500, 'swing');
  });
});

function arrowDownAnimation() {
  $('#down-animate').css({
    opacity: 0,
    bottom: '40px'
  }).delay(1000)
    .stop(true)
    .animate({
      opacity: 1,
      bottom: '10px'
    });
}