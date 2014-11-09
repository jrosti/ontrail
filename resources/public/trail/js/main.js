
var $ = require("jquery")
var _ = require("lodash")
var MediumEditor = require("medium-editor")
var dialog = require("./editor/dialog")

$(document).ready(function() {
  var contentEditor = new MediumEditor(".editable") // instantiate content editor

  var dlg = dialog.create()

})
