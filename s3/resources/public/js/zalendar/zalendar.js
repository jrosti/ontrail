var _ = require("lodash")
var moment = require("moment")
var render = require("./render").renderWeek

var defaultOpts = {
  styles: {
    week: "pure-g pure-u-1",
    day: "pure-u-1-8",
  },
  weekName: _.identity,
  monthData: function(month) { return month % 2 }
}

function zalendar(el, inOpts) {
  var opts = _.merge({}, defaultOpts, inOpts)
  var now = moment();

  var $el = document.getElementById(el)
  var beginningOfMonth = moment(now).date(1).isoWeekday(1)

  // initial fill
  var firstWeek = beginningOfMonth.subtract(2, 'weeks')
  var lastWeek = moment(firstWeek)

  function appendWeek() {
    _.each(render(lastWeek, opts), function(child) {
      $el.appendChild(child)
    })
    lastWeek.add(1, "week")
    return lastWeek
  }

  function prependWeek() {
    firstWeek.subtract(1, "week")
    var height = $el.scrollHeight;
    var top = $el.scrollTop;
    _(render(firstWeek, opts)).reverse().each(function(child) {
      $el.insertBefore(child, $el.children[0])
    })
    $el.scrollTop = top + ($el.scrollHeight - height)
  }

  while($el.scrollHeight < $el.offsetHeight ||
    beginningOfMonth.month() <= appendWeek().month());
  prependWeek()

  $today = document.querySelector("#" + el + " .day")
  var lineHeight = $today.offsetHeight
  $el.scrollTop = lineHeight

  $el.onscroll = function() {
    if($el.scrollTop + $el.offsetHeight - $el.scrollHeight <= lineHeight)
      appendWeek()
    if($el.scrollTop < lineHeight)
      prependWeek()
  }
}


exports.create = zalendar
