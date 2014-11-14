
var $ = require("jquery")
var _ = require("lodash")
var Rx = require('rx')

window.jQuery = $
require("zelect")

var MediumEditor = require("medium-editor")
var moment = require('moment')
var dialog = require("./editor/dialog")
var entry = require("./blog/entry")

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

var savedEntries = entry.drafts.sample(60000)
  .doAction(function(val) { console.log("Try save draft", val) })
  .flatMap(function(entry) {
    return $.postAsObservable("/trail/rest/blog/draft/" + entry.id, entry).catchException(function (error) {
      return Rx.Observable.empty()
    })
  }).subscribe(function(response) {
    console.log("autosave response ", response)
  })

var dates = new Rx.Subject()

$(document).ready(function() {
  // require common parts
  require("./app/menu")
  var user = require("./app/user")

  user.requiredAuths().subscribe(function( profile ) {
    $("#author-fullname").text(profile.user);
    $("#author-image").css("background-image", "url(\'" + profile.avatarUrl + "\')");

    $("#ex-sport").zelect({
      placeholder: "Juoksu, suunnistus, pyöräily, ..."
    });
  })

  var titleEditor = new MediumEditor("#ex-title", titleEditorOpts) // instantiate content editor
  var contentEditor = new MediumEditor(".editable", editorOpts) // instantiate content editor

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
