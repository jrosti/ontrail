
var $ = require("jquery")
var _ = require("lodash")
var Rx = require('rx')
var MediumEditor = require("medium-editor")
var moment = require('moment')
var dialog = require("./editor/dialog")
var entry = require("./blog/entry")
var user = require("./app/user")
var menu = require("./app/menu")

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
  placeholder: "Kerro jotain lenkistäsi ...",
  buttonLabels: 'fontawesome'
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

entry.drafts.subscribe(function(ev) {
  console.log("entry is ", ev)
})

var dates = new Rx.Subject()

$(document).ready(function() {
  var titleEditor = new MediumEditor("#ex-title", titleEditorOpts) // instantiate content editor
  var contentEditor = new MediumEditor(".editable", editorOpts) // instantiate content editor

  menu.create()

  user.requiredAuths().subscribe(function( profile ) {
    console.log("user", profile)
    $("#author-fullname").text(profile.user);
  })

  $('.editable').mediumInsert({
    editor: contentEditor,
    addons: {
      images: {
        imagesUploadScript: '/file-upload/put'
      }
    }
  });

  dates.subscribe(function(date) {
    $("#ex-date").attr("data-timestamp", date).livestamp()
  })

  dates.onNext(moment())

  var dlg = dialog.create()
})
