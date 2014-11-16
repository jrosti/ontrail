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
      $("#page-title").text(entry.title)
      $("#ex-title").text(entry.title)
      $("#ex-body").html(entry.body)
      $("#ex-date").attr("data-timestamp", entry.date).livestamp(date)
      if (fromEditMode) {
        $("#ex-sport").val(entry.sport)
      } else {
        var sport = allSports.find(function(item) { return item.label == entry.sport} ).icon
        $("#distance-logo").toggleClass(sport).show()
      }
      if (entry.distance) {
        $("#distance-text").text(entry.distance).show()
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

  if (entryId) populate(true)
  return { drafts: drafts, allSports: allSports }
}

var allSports = _([
  { "Beach volley": "flaticon-volleyball3" },
  { "Crossfit": "flaticon-weightlift" },
  { "Crosstrainer": "flaticon-person212" },
  { "Cyclocross": "flaticon-time13" },
  { "Golf": "flaticon-golf22" },
  { "Hiihto": "flaticon-ski2" },
  { "Jalkapallo": "flaticon-soccer43" },
  { "Jooga": "flaticon-guru1" },
  { "Jumppa": "flaticon-jump7" },
  { "Juoksu": "flaticon-running30" },
  { "Jääkiekko": "flaticon-ice57" },
  { "Kahvakuula": "flaticon-biceps" },
  { "Kamppailulaji": "flaticon-martial2" },
  { "Kaukalopallo": "flaticon-ice46" },
  { "Kickbike": "flaticon-regular2" },
  { "Kiipeily": "flaticon-climbing6" },
  { "Koripallo": "flaticon-basketball3" },
  { "Kuntopiiri": "flaticon-flexions" },
  { "Kuntopyörä": "flaticon-bicycle14" },
  { "Kuntosali": "flaticon-barbell" },
  { "Kävely": "flaticon-walking17" },
  { "Laskettelu": "flaticon-skiing7" },
  { "Lentopallo": "flaticon-person39" },
  { "Leuanveto": "flaticon-pulling" },
  { "Luistelu": "flaticon-ice49" },
  { "Luisteluhiihto": "flaticon-ski2" },
  { "Lumikenkäily": "flaticon-walking17" },
  { "Lumilautailu": "flaticon-extreme1" },
  { "Maantiepyöräily": "flaticon-time13" },
  { "Maastojuoksu": "flaticon-mountain23" },
  { "Maastopyöräily": "flaticon-mountain24" },
  { "Melonta": "flaticon-padding" },
  { "Nyrkkeily": "flaticon-female139" },
  { "Perinteinen hiihto": "flaticon-ski2" },
  { "Pilates": "flaticon-leg1" },
  { "Potkukelkkailu": "flaticon-trekking" },
  { "Pumppi": "flaticon-dumbbell21" },
  { "Pyöräily": "flaticon-regular2" },
  { "Ratsastus": "flaticon-silhouette2" },
  { "Ringette": "flaticon-ice46" },
  { "Rullahiihto": "flaticon-ski2" },
  { "Rullaluistelu": "flaticon-skater1" },
  { "Salibandy": "flaticon-hockey2" },
  { "Sauvakävely": "flaticon-trekking" },
  { "Seikkailu-urheilu": "flaticon-compass" },
  { "Sisäsoutu": "flaticon-person209" },
  { "Soutu": "flaticon-person209" },
  { "Spinning": "flaticon-bicycle14" },
  { "Squash": "flaticon-squash" },
  { "Sulkapallo": "flaticon-man36" },
  { "Suunnistus": "flaticon-map49" },
  { "Sähly": "flaticon-hockey2" },
  { "Tanssi": "flaticon-american36" },
  { "Telinevoimistelu": "flaticon-individual3" },
  { "Tennis": "flaticon-person17" },
  { "Triathlon": "flaticon-mountain24" },
  { "Uinti": "flaticon-swimming20" },
  { "Vaellus": "flaticon-hiking" },
  { "Venyttely": "flaticon-man252" },
  { "Vesijuoksu": "flaticon-swimming20" },
  { "Yleisurheilu": "flaticon-jumping2" }
]).map(function(sport) {
  var key = _.keys(sport)[0]
  return {
    label: key,
    icon: sport[key],
    value: key
  }
})

exports.edit = edit
exports.populate = populate


