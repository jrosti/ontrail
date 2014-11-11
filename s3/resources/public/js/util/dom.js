var $ = require("jquery")
var _ = require("lodash")

function text(el) { return $(el).text() }
function html(el) { return $(el).html() }
function val(el) { return $(el).val() }

function enable(el, toggle) {
  $(el).attr('disabled', !toggle)
}

exports.text = _.partial(text)
exports.html = _.partial(html)
exports.val = _.partial(val)
exports.enableEl = function(el) { return _.partial(enable, el) }
