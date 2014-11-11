var $ = require("jquery")
var _ = require("lodash")
var Rx = require("rx")
require("rx-jquery")

var parseValidationResult = function(n) {
  function toNext(x) { return new Rx.Notification.createOnNext(x) }
  function parseError () {
      try {
        return toNext({ success: false, message: $.parseJSON(n.value.jqXHR.responseText)['message'] })
      } catch (e) { return toNext({ success: false }) }
  }

  switch (n.kind) {
    case 'E':
      return parseError()
    case 'N': {
      if (n.value.jqXHR.status == 200 && n.value.data.success !== false) return toNext(n.value.data)
      else return parseError()
    }
    default : return n
  }
}

function validate(field, dist) {
  return Rx.Observable.onErrorResumeNext(
    $.getJSONAsObservable('/rest/v1/validate/' + field + '/' + encodeURIComponent(dist))
      .materialize()
      .select(parseValidationResult)
      .dematerialize()
  )
}


function toggle(field, distValidationResult) {
  $("#" + field).toggleClass("hasError", !distValidationResult.success)

  $("#" + field + "-logo").toggle(distValidationResult.success)
  $("#" + field + "-text").toggle(distValidationResult.success)
  if (distValidationResult.success)
    $("#" + field + "-text").text(distValidationResult[field])
}

function createValidatable(field, saves) {

  var changes = $("#" + field).onAsObservable('keyup change')
    .map( function (ev) { return $(ev.target).val() })
    .throttle(300)
    .distinctUntilChanged()
    .repeat()

  var validations = changes.flatMapLatest(_.partial(validate, field))
  validations.subscribe(_.partial(toggle, field))

  validations.sample(saves).subscribe(function (v) { $("#" + field).val(v[field]) })

  return validations.map(function(res) { return res.success })
}

exports.create = function() {
  var saves = $("#details-save").onAsObservable("click")
  var distance = createValidatable("distance", saves)
  var time = createValidatable("time", saves)



  saves.subscribe(function() {
    $("#details-dialog").hide()
  })

  $("#show-details-dialog").onAsObservable("click").subscribe(function() {
    $("#details-dialog").show()
  })

  return {
    distance: distance,
    time: time
  }
}
