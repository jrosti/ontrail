var $ = require("jquery")
var cookie = require("cookie-cutter")
var Rx = require("rx");

var authUser = cookie.get("authUser")

$("body").addClass(authUser || false ? "logged-in" : "logged-out")

function ajaxProfileReq() {
  return $.getJSONAsObservable("/trail/rest/logged-ins")
    .map(function(result) { return result.data; } )
}

exports.auths = (authUser == null) ? Rx.Observable.empty() : ajaxProfileReq()
exports.requiredAuths = function() {
  if (authUser == null) {
    document.location = "/login.html"
    return Rx.Observable.empty()
  }

  return Rx.Observable.of(authUser).flatMapLatest(ajaxProfileReq)
}

exports.logout = function() {
  cookie.set("authUser", null, { expires: new Date(0) })
  cookie.set("authToken", null, { expires: new Date(0) })
  document.location = "/"
}
