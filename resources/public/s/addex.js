$( document ).ready(function() {
  $('input[rel="txtTooltip"]').tooltip();
  var $editor = $('textarea#addex');
  $editor.editable({
    inlineMode: false
  });
  $editor.editable("setHTML", html, true);
});