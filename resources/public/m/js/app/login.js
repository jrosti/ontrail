define(["jquery", "lodash", "bacon", "bacon.jquery", "jquery.cookie"], function($, _, Bacon, bjq) {
    var usernames = bjq.textFieldValue($("#username"))
    var passwords = bjq.textFieldValue($("#password"))

    var logins = bjq.Model.combine({"username": usernames, "password": passwords})
    logins.syncConverter = function(x) { return x || "" }

    function shouldEnableLogin(login) { return login.username.length == 0 || login.password.length == 0 }
    logins.map(shouldEnableLogin).assign($("#login"), "attr", "disabled")

    function loginReq(params) {
        return Bacon.$.lazyAjax( { type: "post", url: "/rest/v1/login", data: params } )
    }

    function profileReq(username) {
        return Bacon.$.lazyAjax( "/rest/v1/logged-ins" ).map(_.partial(_.extend, {username: username}))
    }

    function clearLoginCookie() {
        $.cookie("authToken", null)
        $.cookie("authUser", null)
    }

    function setLoginCookie(login) {
        $.cookie("authToken", login.token, { expires: 365, path: "/" }  )
        $.cookie("authUser", login.username, { expires: 365, path: "/" } )
    }

    function clearPassword() {
        $("#password").value("")
    }

    var loginRequests = logins.sampledBy($("#login").clickE()).flatMapLatest(loginReq)
    var loginErrors = loginRequests.errors().map({})
    var loggedIns = loginRequests.filter(_.identity).doAction(setLoginCookie).map(".username").flatMapLatest(profileReq)
    var loggedOuts = $("#logout").clickE().merge(loginErrors).doAction(clearLoginCookie)
    var loginFromCookie = Bacon.once($.cookie("authUser")).filter(_.identity).flatMapLatest(profileReq)

    // individual streams
    var logins = loggedIns.merge(loginFromCookie)
    var logouts = loggedOuts.merge(Bacon.once($.cookie("authUser")).filter(_.isEmpty))

    // toggle correct body class
    logins.map("logged-in").merge(logouts.map("logged-out")).toProperty().assign($("body"), "attr", "class")

    return {
        logins: logins.toProperty(),
        logouts: logouts.toProperty()
    }
})
