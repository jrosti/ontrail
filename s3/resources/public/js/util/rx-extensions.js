var ƒ = require("./functional")
var Rx = require("rx")

function mkObj(field, content) {
  var obj = {}
  obj[field] = content
  return obj
}

Rx.Observable.prototype.throttledEventTarget = function throttledEventTarget(throttleMs) {
  return this.throttle(throttleMs).map(ƒ.attrF("target"))
}

Rx.Observable.prototype.asObjStream = function asObjStream(field) {
  return this.map(_.partial(mkObj, field))
}
