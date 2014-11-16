var $ = require("jquery")
var _ = require("lodash")
var ð = require("../util/dom")
var ƒ = require("../util/functional")
var Rx = require("rx")
var moment = require("moment")
require("rx-jquery")
require("../util/rx-extensions")

window.jQuery = $
window.moment = moment
require("livestamp")


var entryIdRegex = /\/(edit|entry)\/(.*)/
var entryId = (entryIdRegex.exec(document.location.pathname) || [undefined, undefined, undefined])[2]

function populate(fromEditMode) {
  $.getJSONAsObservable("/trail/rest/blog/" + entryId).map(ƒ.attrF("data"))
    .take(1)
    .subscribe(function(entry) {
      var date = moment.unix(entry.date)
      $("#ex-title").text(entry.title)
      $("#ex-body").html(entry.body)
      $("#ex-date").attr("data-timestamp", entry.date).livestamp(date)
      $("#ex-sport").val(entry.sport)
      if (entry.distance) {
        $("#distance-text").text(entry.distance).show()
        $("#distance-logo").show()
      }
      if (entry.time) {
        $("#time-text").text(entry.time).show()
        $("#time-logo").show()
      }
      if (!fromEditMode) {
        $("#author-fullname").text(entry.user)
        $("#author-image").attr('src', entry.avatar)
      }
    })
}

function edit() {
  function _zipObj(keys) {
    return function() {
      var arr = []
      for (var i = 0; i < arguments.length; i++)
        arr[i] = arguments[i]
      return _.zipObject(keys, arr)
    }
  }

  var titles = $("#ex-title").onAsObservable('input').throttledEventTarget(300).map(ð.text).startWith("")
  var bodies = $("#ex-body").onAsObservable('input').throttledEventTarget(300).map(ð.html).startWith("")
  var distance = $("#ex-distance").onAsObservable('change').map(ƒ.attrF("target")).map(ð.val).startWith("")
  var time = $("#ex-time").onAsObservable('change').map(ƒ.attrF("target")).map(ð.val).startWith("")
  var sport = $("#ex-sport").onAsObservable('change').map(ƒ.attrF("target")).map(ð.val).startWith("")
  var date = $("#ex-date").onAsObservable('change').map(ƒ.attrF("target")).map(ð.attrF('data-timestamp')).startWith("")

  var createdDraft = $.postAsObservable("/trail/rest/blog/draft", {}).map(ƒ.attrF("data"))

  var drafts =
    createdDraft.flatMapLatest(function(blogPost) {
      return Rx.Observable.combineLatest([titles, bodies, distance, time, sport, date], _zipObj(["title", "body", "distance", "time", "sport", "date"]))
        .map(function(values) { return _.merge({}, blogPost, values) })
    }).distinctUntilChanged().skip(1)

  return { drafts: drafts};
}

exports.edit = edit
exports.populate = populate


