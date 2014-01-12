define(["jquery", "bacon", "bacon.jquery", "ontrail/ex", "jquery.cookie"], function($, Bacon, bjq, ex) {
    if (!$.cookie("authToken")) {
        document.location = "login.html"
        return {}
    }

    function renderEx(exercises) {
        console.log(exercises)
    }

    ex.exercises({}).onValue(renderEx)
})
