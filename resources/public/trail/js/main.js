
var $ = require("jquery")
var _ = require("lodash")
var MediumEditor = require("medium-editor")
var dialog = require("./editor/dialog")
var moment = require('moment')
window.jQuery = $
var timeago = require('jquery-timeago')
var Rx = require('rx')

var editorOpts = {
  cleanPastedHTML: true,
  placeholder: "Kerro jotain lenkistäsi ..."
}

var titleEditorOpts = {
  cleanPastedHTML: true,
  disableReturn: true,
  disableDoubleReturn: true,
  firstHeader: 'h1',
  secondHeader: 'h2',
  disableToolbar: true,
  placeholder: "Naseva otsikko lenkillesi!"
}

var dates = new Rx.Subject()

$(document).ready(function() {
  var titleEditor = new MediumEditor("#ex-title", titleEditorOpts) // instantiate content editor
  var contentEditor = new MediumEditor(".editable", editorOpts) // instantiate content editor

  dates.subscribe(function(dateStr) {
    $("#ex-date").attr("title", dateStr).timeago()
  })

  var now = moment().utc().format("YYYY-MM-DD\THH:mm:SS") + "Z";
  dates.onNext(now)

  var dlg = dialog.create()
})
