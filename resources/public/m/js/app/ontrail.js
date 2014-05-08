define(["jquery", "bacon", "bacon.jquery", "app/login", "ontrail/ex", "ontrail/list-ui", "jquery.cookie"], function($, Bacon, bjq, session, ex, list) {
  function renderEx(exercises) {
      return "<div style=\"min-height: 300px\">refreshed</div>"
  }

  var updates = list.create("#content", ex.exercises, renderEx)
  updates.onValue(function() { console.log("fresh", arguments) })
})
