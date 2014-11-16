var _ = require("lodash")
var moment = require("moment")

var today = moment()

function e(name, attrs) {
  var $el = document.createElement(name)
  _(attrs || {}).forOwn(function(value, key) {
    $el.setAttribute(key, value)
  })
  return $el
}

function textE(name, text, attrs) {
  var $el = e(name, attrs)
  var $t = document.createTextNode(text);
  $el.appendChild($t)
  return $el
}

function renderDate(timestamp, opts) {
  var dateClass = ((timestamp.isSame(today, 'day')) ? "day today " : "day ") + (opts.styles.day || "")

  var $el = e("div", { "class": dateClass, "data-timestamp": timestamp, "data-month": opts.monthData(timestamp.month()) })
  $el.appendChild(textE("span", timestamp.date()))
  return $el
}

var weekdays = _(_.range(1, 8))

function renderWeek(timestamp, opts) {
  var week = e("div", { "class":  "week " + (opts.styles.week || ""), "data-week-of-year": opts.weekName(timestamp.week()) })

  var items = [week]

  weekdays.each(function(wd) {
    var weekday = moment(timestamp).isoWeekday(wd)
    if (weekday.month() != timestamp.month() && weekday.date() == 1 || timestamp.date() ==1 && weekday.date() == 1) {
      var month = e('div', {"class": "month " + "month-" + weekday.month(), "data-month": weekday.month()})
      items = [month, week]
    }

    week.appendChild(renderDate(weekday, opts))
  })
  return items
}

exports.renderWeek = renderWeek
