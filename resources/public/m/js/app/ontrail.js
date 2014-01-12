define(["jquery", "bacon", "bacon.jquery", "ontrail/ex", "ontrail/list-ui", "jquery.cookie"], function($, Bacon, bjq, ex, list) {
    if (!$.cookie("authToken")) {
        document.location = "login.html"
        return {}
    }

    function renderEx(exercises) {
        return "<div style=\"min-height: 300px\">refreshed</div>"
    }

    var updates = list.create("#content", ex.exercises, renderEx)
    updates.onValue(function() { console.log("fresh", arguments) })
})
