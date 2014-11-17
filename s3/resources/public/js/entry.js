var $ = require("jquery")
var _ = require("lodash")

$(document).ready(function() {
  require("./app/menu")
  var user = require("./app/user") // initialize logged-in state
  var entry = require("./blog/entry").populate()

  entry.combineLatest(user.auths, function(a, b) { return [a,b] } ).subscribe(function(params) {
    var entry = params[0]
    var user = params[1].user
    if (entry.user == user) {
      $("#edit-menu").show()
      $("#edit-button").onAsObservable('click').subscribe(function() { document.location = "/edit/" + entry.id })
    }
  })
})

