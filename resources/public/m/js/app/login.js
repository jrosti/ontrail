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

    function logoutReq() {
        return Bacon.$.lazyAjax( { type: "post", url: "/rest/v1/logout" })
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

    var loginRequests = logins.sampledBy($("#login").clickE()).flatMapLatest(loginReq)
    var loginErrors = loginRequests.errors().map({})
    var loggedIns = loginRequests.filter(_.identity).doAction(setLoginCookie).map(".username").flatMapLatest(profileReq)
    var loggedOuts = $("#logout").clickE().merge(loginErrors).flatMapLatest(logoutReq).doAction(clearLoginCookie)

    return loggedIns.merge(loggedOuts)
})
