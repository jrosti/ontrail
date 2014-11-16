var $ = require("jquery")
var _ = require("lodash")

function attr(name, el) { return $(el).attr(name) }
function attrF(name) { return _.partial(attr, name) }
function text(el) { return $(el).text() }
function html(el) { return $(el).html() }
function val(el) { return $(el).val() }

function enable(el, toggle) {
  $(el).attr('disabled', !toggle)
}

exports.attrF = attrF
exports.text = _.partial(text)
exports.html = _.partial(html)
exports.val = _.partial(val)
exports.enableEl = function(el) { return _.partial(enable, el) }
