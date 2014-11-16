
var $ = require("jquery")
var _ = require("lodash")
var ƒ = require("./util/functional")
var Rx = require('rx')

window.jQuery = $
require("zelect")

var MediumEditor = require("medium-editor")
var moment = require('moment')
var dialog = require("./editor/dialog")
var entry = require("./blog/entry").edit()

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

function saveDraft(entry) {
  return $.postAsObservable("/trail/rest/blog/" + entry.id + "/draft", entry).map(ƒ.attrF("data")).catchException(function (error) {
    return Rx.Observable.empty()
  })
}

function publishBlog(entry) {
  return $.postAsObservable("/trail/rest/blog/" + entry.id, entry).map(ƒ.attrF("data")).catchException(function(error) {
    return Rx.Observable.empty()
  })
}

var savedEntries = entry.drafts.take(1).merge(entry.drafts.skip(1).sample(60000))
  .flatMap(saveDraft).subscribe(function(response) {}) //autosaved?

var dates = new Rx.Subject()

$(document).ready(function() {
  // require common parts
  require("./app/menu")
  var user = require("./app/user")

  user.requiredAuths().subscribe(function( profile ) {
    $("#author-fullname").text(profile.user);
    $("#author-image").css("background-image", "url(\'" + profile.avatarUrl + "\')");

    $("#ex-sport").zelect({
      placeholder: "Juoksu, suunnistus, pyöräily, ...",
      loader: function(term, page, callback) {
        if (page > 0) {
          callback([]);
          return;
        }

        var sportsMatcher = new RegExp('(^|\\s)'+term, 'i')
        callback(entry.allSports.filter(function(sport) {
          return sportsMatcher.test(sport.label)
        }).value())
      },
      renderItem: function(item) {
        return $("<span>", {class: item.icon}).text(" " + item.label)
      },
      renderPlaceholder: function(item) { return }
    });

    $("#ex-sport").onAsObservable('change').map(function(ev) {
      return ev.additionalArguments[0]
    }).subscribe(function(sport) {
      $("#distance-logo").attr('class', sport.icon)
    })

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

  var dlg = dialog.create()

  dlg.date.subscribe(function(date) {
    $("#ex-date").attr("data-timestamp", date).livestamp(date).trigger('change')
  })

  function isEntryValid(entry) {
    var body = $(entry.body).filter("p").text()
    return !(!body) && body.trim() != ""
  }

  entry.drafts.map(isEntryValid).subscribe(function(publishEnabled) {
    $("#publish").toggleClass('pure-button-disabled', !publishEnabled)
  })

  entry.drafts.combineLatest($('#publish').onAsObservable('click'), _.identity).filter(isEntryValid)
    .flatMap(saveDraft)
    .flatMap(publishBlog)
    .subscribe(function(e ) {
      document.location = "/entry/" + e.sid + "?published" // go to blog entry page and prompt for sharing.
    })
})
