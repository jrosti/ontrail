var $ = require("jquery")
var _ = require("lodash")

$(document).ready(function() {
  require("./app/menu")
  var user = require("./app/user") // initialize logged-in state
  var entries = require("./blog/entry")


  entries.currentEntry().combineLatest(user.auths, function(a, b) { return [a,b] } ).subscribe(function(params) {
    var entry = params[0]
    var user = params[1].user
    entries.populate(entry)
    if (entry.user == user) {
      $("#edit-menu").show()
      $("#edit-button").onAsObservable('click').subscribe(function() { document.location = "/edit/" + entry.id })
    }
  })
})

