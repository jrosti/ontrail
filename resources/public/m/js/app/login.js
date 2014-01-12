define(["jquery", "bacon", "bacon.jquery", "jquery.cookie"], function($, Bacon, bjq) {
    if ($.cookie("authToken")) {
        document.location = "index.html"
        return {}
    }

    var usernames = bjq.textFieldValue($("#username"))
    var passwords = bjq.textFieldValue($("#password"))

    var logins = bjq.Model.combine({"username": usernames, "password": passwords})
    logins.syncConverter = function(x) { return x || "" }

    function shouldEnableLogin(login) { console.log("laa", login); return login.username.length == 0 || login.password.length == 0 }
    logins.map(shouldEnableLogin).assign($("#login"), "attr", "disabled")

    return {}
})
