var $ = require("jquery")
var _ = require("lodash")
var ð = require("../util/dom")
var ƒ = require("../util/functional")
var Rx = require("rx")
require("rx-jquery")
require("../util/rx-extensions")

function mkObj(field, content) {
  var obj = {}
  obj[field] = content
  return obj
}

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

var drafts = Rx.Observable.combineLatest(
  [titles, bodies, distance, time, sport],
  _zipObj(["title", "body", "distance", "time", "sport"])
).distinctUntilChanged().skip(1)

exports.drafts = drafts;
