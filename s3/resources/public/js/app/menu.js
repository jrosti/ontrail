var $ = require("jquery")
var ƒ = require("../util/functional")
var Rx = require("rx")
var cookie = require("cookie-cutter")
require("rx-jquery")

$("#show-menu").onAsObservable("click").subscribe(function() {
  $("body").toggleClass("menu-collapsed")
  $("#side-menu .pure-menu").toggleClass("pure-menu-open")
})

var user = require("./user")

$("#logout").onAsObservable("click").subscribe(user.logout)

user.auths.flatMap(function(profile) {
  return $.getJSONAsObservable("/trail/rest/blog/list/drafts").map(ƒ.attrF("data"))
}).subscribe(function(drafts) {

  console.log("drafts", drafts)
})
