var _ = require("lodash")

function attr(name, obj) { return obj[name] }
function _attr(name) { return _.partial(attr, name) }

function _zipObj(keys) {
  return function() {
    var arr = []
    for (var i = 0; i < arguments.length; i++)
      arr[i] = arguments[i]
    return _.zipObject(keys, arr)
  }
}

exports.attr = attr
exports.attrF = _attr
exports.zipObjectF = _zipObj
