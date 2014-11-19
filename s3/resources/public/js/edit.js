
var $ = require("jquery")
var _ = require("lodash")
var ƒ = require("./util/functional")
var Rx = require('rx')

window.jQuery = $
require("zelect")

var moment = require('moment')
var dialog = require("./editor/dialog")
var entries = require("./blog/entry")

// shims
window.jQuery = $
window.moment = moment
window.MediumEditor = MediumEditor
$.fn.MediumEditor = MediumEditor
require('livestamp')
require("medium-editor-insert-plugin")
require("medium-editor-insert-images")

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

var dates = new Rx.Subject()

$(document).ready(function() {

  $("body").addClass("editing")

  // require common parts
  require("./app/menu")
  var user = require("./app/user")

  var currentEntry = entries.currentEntry().catchException(entries.create)
  user.requiredAuths().zip(currentEntry, function(a,b) {return [a,b]}).subscribe(function( profileAndEntry ) {
    var profile = profileAndEntry[0]
    var entry = profileAndEntry[1]

    $("#author-fullname").text(profile.user);
    $("#author-image").css("background-image", "url(\'" + profile.avatarUrl + "\')");

    entries.populate(entry, true)
    var drafts = entries.edit(entry)
    var savedEntries = drafts.take(1).merge(drafts.skip(1).sample(3000))
       .flatMap(saveDraft).subscribe(function(response) {}) //autosaved?

    drafts.map(isEntryValid).subscribe(function(publishEnabled) {
      $("#publish").toggleClass('pure-button-disabled', !publishEnabled)
    })

    drafts.combineLatest($('#publish').onAsObservable('click'), _.identity).filter(isEntryValid)
      .flatMap(saveDraft)
      .flatMap(publishBlog)
      .subscribe(function(e ) {
        document.location = "/entry/" + e.sid + "?published" // go to blog entry page and prompt for sharing.
      })

    $("#ex-sport").zelect({
      placeholder: "Juoksu, suunnistus, pyöräily, ...",
      loader: function(term, page, callback) {
        if (page > 0) {
          callback([]);
          return;
        }

        var sportsMatcher = new RegExp('(^|\\s)'+term, 'i')
        callback(entries.allSports.filter(function(sport) {
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

  var dlg = dialog.create()

  dlg.date.subscribe(function(date) {
    $("#ex-date").attr("data-timestamp", date).livestamp(date).trigger('change')
  })

  function isEntryValid(entry) {
    var body = $(entry.body).filter("p").text()
    return !(!body) && body.trim() != ""
  }
})
