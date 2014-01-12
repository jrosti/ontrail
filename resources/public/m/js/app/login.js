define(["jquery", "bacon", "bacon.jquery"], function($, Bacon, bjq) {
    var usernames = bjq.textFieldValue($("#username"))

    $("#login").clickE().onValue(function(e) { console.log(e)} )
})
