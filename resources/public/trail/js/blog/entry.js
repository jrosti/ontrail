var $ = require("jquery")
var _ = require("lodash")
var Rx = require("rx")
require("rx-jquery")

function attr(name, obj) {
  return obj[name]
}
function _attr(name) {
  return _.partial(attr, name)
}

function mkObj(field, content) {
  var obj = {}
  obj[field] = content
  return obj
}

var _text = function text(el) {
  return $(el).text()
}

var _html = function html(el) {
  return $(el).html()
}

function _zipObj(keys) {
  return function() {
    var arr = []
    for (var i = 0; i < arguments.length; i++)
      arr[i] = arguments[i]
    return _.zipObject(keys, arr)
  }
}

Rx.Observable.prototype.throttledEventTarget = function throttledEventTarget(throttleMs) {
  return this.throttle(throttleMs).map(_attr("target"))
}

Rx.Observable.prototype.asObjStream = function asObjStream(field) {
  return this.map(_.partial(mkObj, field))
}

var titles = $("#ex-title").onAsObservable('input').throttledEventTarget(300).map(_text).startWith("")
var bodies = $("#ex-body").onAsObservable('input').throttledEventTarget(300).map(_html).startWith("")

var drafts = Rx.Observable.combineLatest([titles, bodies], _zipObj(["title", "body"]))

exports.drafts = drafts;
