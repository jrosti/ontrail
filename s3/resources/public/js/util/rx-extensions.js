var ƒ = require("./functional")
var Rx = require("rx")

Rx.Observable.prototype.throttledEventTarget = function throttledEventTarget(throttleMs) {
  return this.throttle(throttleMs).map(ƒ.attrF("target"))
}

Rx.Observable.prototype.asObjStream = function asObjStream(field) {
  return this.map(_.partial(mkObj, field))
}
