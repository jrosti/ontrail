var $ = require("jquery")
var Rx = require("rx")
var cookie = require("cookie-cutter")
require("rx-jquery")

exports.create = function () {
  $("#show-menu").onAsObservable("click").subscribe(function() {
    $("body").toggleClass("menu-collapsed")
    $("#side-menu .pure-menu").toggleClass("pure-menu-open")
  })

  $("#logout").onAsObservable("click").subscribe(function() {
    cookie.set("authUser", null, { expires: new Date(0) })
    cookie.set("authToken", null, { expires: new Date(0) })
    document.location = "/"
  })

}
