// type ValidationResult = [String]
// type Validation = Observable ValidationResult

/*
 * Validations can be lifted into a monad to compose them in such a way that
 * the subsequent validations are not computed after a validation fails:
 *
 * vMonad(v1).bind(function(res1) { return vMonad(v2) }).toValidation()
 */
function ValidationMonad(validation) {
  this.bind = function(f) {
    return new ValidationMonad(validation.selectMany(function(res) {
      if (!success(res)) return Rx.Observable.returnValue(res)
      else return f(res).toValidation()
    }))
  }

  this.toValidation = function() { return validation }
}

function vMonad(validation) { return new ValidationMonad(validation) }

$(function() {
  $.fn.changes = function() {
    return eventSourceFor(this, ["keyup", "blur"])
  }

  $.fn.allChanges = function() {
    var source = this
    return eventSourceFor(source, ["keyup", "blur"]).mergeTo(source.toObservable("valueChange").select(function(event) { return currentValue(source) }))
  }

  $.fn.liveChanges = function() {
    return liveEventSourceFor(this, ["keyup", "blur"])
  }

  $.fn.clicks = function() {
    return eventSourceFor(this, ["click"])
  }

  // Bool -> String -> ValidationResult
  Boolean.prototype.orFailure = function(failure) {
    if (this == true) return []
    else return [failure]
  }

  // Validation -> Validation -> Validation
  Rx.Observable.prototype.validWhileInvalid = function(other) {
    return this.validWhile(other, function(currentValue) { return currentValue.length > 0 })
  }

  // Validation -> Validation -> String -> Validation
  Rx.Observable.prototype.validWhileEqual = function(other, value) {
    return this.validWhile(other, function(currentValue) { return currentValue == value })
  }

  // Validation -> Validation -> (String -> Bool) -> Validation
  Rx.Observable.prototype.validWhile = function(other, predicate) {
    return this.combineLatest(other, function(v1, v2) { return [v1, v2] })
      .select(function(vs) { if (predicate(vs[1])) return []
      else return vs[0] } )
  }
})

// () -> (String -> ValidationResult)
function requiredV() {
  return function(x) {
    return ($.trim(x).length > 0).orFailure("required")
  }
}

// Int -> (String -> ValidationResult)
function maxV(maxVal) {
  return function(x) {
    return (parseFloat(x) <= maxVal).orFailure("too_big")
  }
}

// Int -> (Num -> ValidationResult)
function minV(minVal) {
  return function(x) {
    return (parseFloat(x) >= minVal).orFailure("too_small")
  }
}

// Int -> (Num -> ValidationResult)
function minLengthV(minLen) {
  return function(x) {
    return (x.length >= minLen).orFailure("too_short")
  }
}

//
// Int -> (Num -> ValidationResult)
function maxLengthV(maxLen) {
  return function(x) {
    return (x.length <= maxLen).orFailure("too_long")
  }
}

// Int -> Int -> (String -> ValidationResult)
function lengthV(minLen, maxLen) {
  return function(x) {
    return (x != undefined && x.length >= minLen && x.length <= maxLen).orFailure("not_between")
  }
}

// () -> (String -> ValidationResult)
function numberV() {
  return function(x) {
    return (($.trim(x).length > 0) && !isNaN(x)).orFailure("not_number")
  }
}

// () -> ([Num] -> ValidationResult)
function orderV() {
  return function() {
    var prev = parseFloat(arguments[0])
    for (var i = 1; i < arguments.length; i = i + 1) {
      if (parseFloat(arguments[i]) < prev) return ["invalid_order"]
      prev = parseFloat(arguments[i])
    }
    return []
  }
}

// () -> ((String, String) -> ValidationResult)
function matchingValuesV() {
  return function(x1, x2) {
    return ($.trim(x1) === $.trim(x2)).orFailure("match")
  }
}

// () -> ((String, String) -> ValidationResult)
function matchingRawValuesV() {
  return function(x1, x2) {
    return (x1 === x2).orFailure("match")
  }
}

// () -> (String -> ValidationResult)
function emailV() {
  return function(x) {
    var validEmail = /^([A-Za-z0-9\x27\x2f!#$%&*+=?^_`{|}~-]+(\.[A-Za-z0-9\x27\x2f!#$%&*+=?^_`{|}~-]+)*)@(([a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]|[a-zA-Z0-9]{1,63})(\.([a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]|[a-zA-Z0-9]{1,63}))*\.[a-zA-Z0-9]{2,63})$/
    var localPart = x.substring(0, x.indexOf('@'))
    return (localPart.length <= 64 && validEmail.test(x)).orFailure("invalid_email")
  }
}

// extend XDate parsing
var parseDate
(function() {

  var toValidDate = function(year, month, day) {
    var date = new XDate(year, month-1, day)
    if ((date.getYear()+1900) == year && date.getMonth() == (month-1) && date.getDate() == day)
      return date;
    return null;
  }

  var stringsToDate = function(parts) {
    if (parts === null)
      return null;
    if (parts[1].length == 4) return toValidDate(parseInt(parts[1]), parseInt(parts[3]), parseInt(parts[5]))
    else if (parts[5].length == 4) return toValidDate(parseInt(parts[5]), parseInt(parts[3]), parseInt(parts[1]))
    return toValidDate(2000 + parseInt(parts[5]), parseInt(parts[3]), parseInt(parts[1]))
  }

  parseDate = function(str) {
    var validDate = /^(\d{1,2}|\d{4})(\.|-|\/)(\d{1,2})(\.|-|\/)(\d{1,2}|\d{4})$/
    return stringsToDate(validDate.exec(str));
  }

  XDate.parsers.push(parseDate);
})()

// () -> (String -> ValidationResult)
function dateV() {
  return function(date) {
    return (date != null && date.valid()).orFailure("invalid_date")
  }
}

function dateInThePastV() {
  return function(date) {
    return (date == null || date.diffDays(new XDate()) > 0).orFailure("date_too_new")
  }
}

// () -> (String -> ValidationResult)
function moneyV() {
  return function(e) {
    var valid = /^((0)|([1-9][0-9]*))([,\.][0-9]{2})?$/
    return (valid.test($.trim(e))).orFailure("invalid_money")
  }
}

// String -> (String -> ValidationResult)
function charV(allowed) {
  return function(x) {
    for(i = 0; i < x.length; i++) {
      if (allowed.indexOf(x.charAt(i)) == -1)
        return ["forbidden_char"]
    }
    return []
  }
}

// (() -> ValidationResult) -> ValidationResult -> ValidationResult
function ifOkThenV(validator) {
  return function(vnResult) {
    if (vnResult.length == 0) return validator()
    else return vnResult
  }
}

// (String -> ValidationResult) -> (String -> ValidationResult)
function okWhen(predicate, validatorF) {
  return function() {
    if (forall(arguments, function(a) { return predicate(a) }))
      return []
    else
      return validatorF.apply(this, arguments)
  }
}

// (String -> ValidationResult) -> (String -> ValidationResult)
function emptyOk(validatorF) { return okWhen(isEmpty, validatorF) }

// (String -> ValidationResult)... -> (String -> ValidationResult)
function andV() {
  var validators = []
  for (var i = 0; i < arguments.length; i++)
    validators.push(arguments[i])

  return function() {
    var result = []
    for (var i = 0; i < validators.length; i++)
      result.push(validators[i].apply(this, arguments))
    return _.flatten(result)
  }
}

// (String -> ValidationResult) -> (String -> ValidationResult)
function notV(validatorF) {
  return function() {
    var errors = validatorF.apply(this, arguments)
    if (errors.length == 0)
      return ["not"]
    else
      return []
  }
}

// Observable a -> (a -> ValidationResult) -> Validation
function mkValidation(observable, validator) {
  return observable.selectArgs(validator)
}

// FIXME: convert for only accepted status codes
// Notification a -> Notification ValidationResult
function convertToResponseNotification(n) {
  function toNext(x) { return new Rx.Notification('N', x) }

  switch (n.kind) {
    case 'E':
      try {
        return toNext([$.parseJSON(n.value.xmlHttpRequest.responseText)['message']])
      } catch (e) { return n }
    case 'N':
      if (n.value.xmlHttpRequest.status == 200 && n.value.data.success !== false) return toNext([])
      else return toNext(n.value.data.message) // check if this could be return as array instead
    default : return n
  }
}

// Observable String -> String -> (String -> Validation) -> (Validation, Observable a, Observable a)
function mkServerValidation(observable, url, validation, _method) {
  var method = _method || "GET"

  if (typeof validation !== 'function') {
    validation = function(url) {
      return function(value) {
        if ($.trim(value) == "") return Rx.Observable.returnValue([])
        return $.ajaxAsObservable({ url: url + encodeURIComponent(value), dataType: "json", type: method })
          .materialize()
          .select(convertToResponseNotification)
          .dematerialize()
          .catchException(Rx.Observable.returnValue([]))
      }}
      
  }

  var throttle = observable.throttle(133).distinctUntilChanged()
  var serverHit = throttle.select(validation(url)).switchLatest().publish()
  serverHit.connect()
  return { validation: serverHit, requestOn: throttle, requestOff: serverHit }
}

// NB: do not use with fastpathajax.php, use mkFastpathValidationWithProgress instead
// Observable String -> String -> Element -> (String -> Validation) -> Validation
function mkServerValidationWithProgress(observable, url, progressIndicator, validation, _method) {
  var serverValidation = mkServerValidation(observable, url, validation, _method)
  serverValidation.requestOn.where(notEmpty).subscribe(function() { progressIndicator.addClass("on-validate") })
  var indicatorOff = function() { progressIndicator.removeClass("on-validate") }
  serverValidation.requestOff.subscribe(indicatorOff, indicatorOff, indicatorOff)
  return serverValidation.validation
}

// String -> Boolean
function notEmpty(x) { return x != "" }

// JQuery -> [String] -> Observable String
function eventSourceFor(selector, events) {
  var initialValue = currentValue(selector)
  var changes = selector.onAsObservable(events.toString().replace(/,/g, " "))
    .select(function(event) { return currentValue(selector) })
  return changes.mergeTo(Rx.Observable.returnValue(initialValue)).distinctUntilChanged()
}

function liveEventSourceFor(selector, events) {
  var initialValue = currentValue(selector)
  var changes = selector.toLiveObservable(events.toString().replace(/,/g, " "))
    .select(function(event) { return currentValue(selector) })
  return changes.mergeTo(Rx.Observable.returnValue(initialValue != undefined ? initialValue : "")).distinctUntilChanged()
}

// JQuery -> String
function currentValue(selector) {
  if (selector.attr('type') == 'checkbox') {
    if (selector.attr('checked')) return selector.val()
    else return ""
  } else {
    return selector.val()
  }
}

// [Observable String] -> Validation
function required(xs) {
  return combine($.map(xs, function(x) { return mkValidation(x, requiredV()) }))
}

// ValidationResult -> Bool
function success(failures) {
  return failures.length == 0
}

function toggleDisableEnter(form) {
  return toggle(
    function() { form.unbind('keypress keyup keydown') },
    function() {
      form.bind('keypress keyup keydown', function(e) {
        if (e.keyCode === 13) return false
      })
    }
  )
}

// Element -> String -> (ValidationResult -> ())
function toggleClassEffect(field, className) {
  return toggle(
    function() { field.removeClass(className) },
    function() { field.addClass(className) }
  )
}

function toggleVisible(component) {
  return toggle(
    function() { component.css('visibility', 'hidden') },
    function() { component.css('visibility', 'visible') }
  )
}

// Element -> (ValidationResult -> ())
function toggleDisplayEffect(component, displayCss) {
  return toggle(
    function() { component.hide() },
    function() { component.css('display', displayCss) }
  )
}

function toggleEffect(component) { return toggleDisplayEffect(component, 'block') }
function toggleInlineEffect(component) { return toggleDisplayEffect(component, 'inline') }

function toggleBetween(errorF, successF) {
  return function (errors) {
    toggleEffect(errorF)(errors)
    toggleEffect(successF)(errors.length == 0 ? ["not"] : [])
  }
}

function toggleFadeEffect(component, ms, display) {
  var ms = ms || 200, display = display || 'block'
  return toggle(
    function () { component.fadeOut(ms) },
    function () { component.fadeIn(ms).css('display', display) }
  )
}

// Element -> (ValidationResult -> ())
function disableEffect(component) {
  return toggle(
    function() { component.removeAttr('disabled') },
    function() { component.attr('disabled', 'disabled') }
  )
}

// (() -> Element) -> (ValidationResult -> ())
function disableEffectLazy(component) {
  return function(p) {
    if (success(p)) {
      component().removeAttr('disabled')
    } else {
      component().attr('disabled', 'disabled')
    }
  }
}

function toggle(successF, failureF) {
  return function(p) {
    if (success(p)) return successF()
    else return failureF()
  }
}

// ValidationResult -> Bool
function failure(failures) {
  return failures.length != 0
}

function onError(errs) {
  return function(err) {
    if (failure(err)) {
      ($(errs[err] != undefined ? errs[err] : errs._)).show()
    }
  }
}

// [ValidationResult] -> ValidationResult
function any() {
  var combined = []
  for (var i = 0; i < arguments.length; i = i + 1) {
    if (success(arguments[i]))
      return []
    combined = combined.concat(arguments[i])
  }
  return combined
}

// [Validation] -> Validation
function anyValidation() {
  function toArray(v) { return v.select(function(x) { return [x] }) } // because combine flattens out success
  return mkValidation(combine(_.map(arguments, toArray)), any)
}

// [Observable a] -> (a -> a -> a)? -> Observable [a]
function combine(xs, combinator) {
  function flatten(x1, x2) {
    return $.map(Array(x1, x2), identity)
  }
  var combinator = combinator || flatten

  var combined = xs[0]
  for (i = 1; i < xs.length; i = i+1) {
    combined = combined.combineLatest(xs[i], combinator)
  }
  return combined
}

// Combines validators into one validator using Zip instead of CombineLatest.
// [Observable a] -> Observable [a]
function zipCombine(xs) {
  function flatten() { return _.flatten(arguments) }
  return _.reduce(
    _.rest(xs),
    function (combined, v) { return combined.zip(v, flatten) },
    xs[0]
  )
}

// [a] -> (a -> Bool) -> Bool
function forall(xs, p) {
  return $.grep(xs, p).length == xs.length
}

// a -> Bool
function isEmpty(a) { return a == null || $.trim(a) == "" }

// Int -> (Int -> ValidationResult)
function intMinV(minVal) {
  return function(x) {
    var validInt = /^[0-9]*$/
    return (validInt.test(x) && x >= minVal).orFailure("too_small")
  }
}

// a -> (a -> ValidationResult)
function expectedV(expected) {
  return function(value) {
    return (value == expected).orFailure("not_expected")
  }
}