var $ = require("jquery")
var cookie = require("cookie-cutter")
var Rx = require("rx");

var authUser = cookie.get("authUser")

$("body").addClass(authUser || false ? "logged-in" : "logged-out")

function ajaxProfileReq() {
  return $.getJSONAsObservable("/trail/rest/logged-ins")
    .map(function(result) { return result.data; } )
}

exports.requiredAuths = function() {
  if (authUser == null) {
    document.location = "/login.html"
    return Rx.Observable.empty()
  }

  return Rx.Observable.of(authUser).flatMapLatest(ajaxProfileReq)
}
