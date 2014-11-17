var $ = require("jquery")
var ƒ = require("../util/functional")
var Rx = require("rx")
require("rx-jquery")

$("#show-menu").onAsObservable("click").subscribe(function() {
  $("body").toggleClass("menu-collapsed")
  $("#side-menu .pure-menu").toggleClass("pure-menu-open")
})

var user = require("./user")

user.auths.subscribe(function(profile) {
  $('.username').text(profile.user)
})

$("#logout").onAsObservable("click").subscribe(user.logout)
$("#to-home").onAsObservable("click").subscribe(function() { document.location = "/" })
