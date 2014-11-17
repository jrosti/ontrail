var $ = require("jquery")
var ð = require("./util/dom")
var ƒ = require("./util/functional")

$(document).ready(function() {
  require("./app/menu")
  require("./app/user") // initialize logged-in state
  require("./blog/entry").entries("#blog-posts")

  $("#blog-posts").onAsObservable('click', ".entry-preview")
    .map(ƒ.attrF("target"))
    .map(function(el) { console.log(el); return $(el).parent(".entry-preview").attr("data-sid")})
    .subscribe(function(sid) {
      document.location = "/entry/" + sid
    })
})
