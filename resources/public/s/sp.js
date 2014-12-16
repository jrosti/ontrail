$( document ).ready(function() {
  $('input[rel="txtTooltip"]').tooltip();
  var $editor = $('textarea#addex');
  /*var html = $editor.val();
  console.log($editor, html)*/
  $editor.editable({
    inlineMode: false
  });
  $editor.editable("setHTML", html, true);
});