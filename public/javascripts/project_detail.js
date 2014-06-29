$(document).ready(function(){
  var $detail = $('#project').find('div.inner');
  var detail = $detail.html();
  detail = detail.replace(/^\s+|\s+$/g, '');
  var html = marked(detail);
  $detail.html(html);
  prettyPrint();
});