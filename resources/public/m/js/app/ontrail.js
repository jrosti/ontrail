define(["jquery", "bacon", "bacon.jquery", "jquery.cookie"], function($, Bacon, bjq) {

    var OnTrail = {}

    OnTrail.logout = function() {
        document.location = "login.html"
    }

    if (!$.cookie("authToken")) {
        OnTrail.logout()
    }
})
