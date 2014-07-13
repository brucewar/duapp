// configure marked for all pages
var renderer = new marked.Renderer();
renderer.code = function(code, lang) {
  var ret = '<div class="row"><div class="col-md-8 col-sm-12"><pre class="prettyprint language-' + lang + '">';
  ret+= '<code>' + code.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</code>';
  ret+= '</pre></div></div>';
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

$(document).ready(function(){
  prettyPrint();

  $('#navbar').find('a').each(function(){
    if($(this).attr('href') === location.pathname){
      $(this).parent().addClass('active');
    }
  });

  var $backtotop = $('#backtotop');
  $backtotop.click(function(){
    $('body,html').animate({scrollTop: 0});
  });
  $(window).scroll(function(){
    var windowHeight = $(window).scrollTop();
    windowHeight > 200 ? $backtotop.fadeIn() : $backtotop.fadeOut();
  });
});