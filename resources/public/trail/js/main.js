
var $ = require("jquery")
var _ = require("lodash")
var Rx = require('rx')
var MediumEditor = require("medium-editor")
var dialog = require("./editor/dialog")
var moment = require('moment')

// shims
window.jQuery = $
window.moment = moment
window.MediumEditor = MediumEditor
$.fn.MediumEditor = MediumEditor
require('livestamp')
require("medium-editor-insert-plugin")
require("medium-editor-insert-images")

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

  $('.editable').mediumInsert({
    editor: contentEditor,
    addons: {
      images: {
        imagesUploadScript: 'http://ontrail.net/file-upload/put'
      }
    }
  });

  dates.subscribe(function(date) {
    $("#ex-date").attr("data-timestamp", date).livestamp()
  })

  dates.onNext(moment())

  var dlg = dialog.create()
})
