
var $ = require("jquery")
var cookie = require('cookie-cutter');
var Rx = require("rx")
var ƒ = require("./util/functional")
var ð = require("./util/dom")
require("rx-jquery")

function values(elem) {
  return $(elem).onAsObservable('keyup blur change')
    .map(ƒ.attrF("target"))
    .map(ð.val)
    .startWith("").throttle(300)
}

function model(streams, keys) {
  return Rx.Observable.combineLatest(streams, ƒ.zipObjectF(keys)).distinctUntilChanged()
}

function shouldEnableLogin(login) {
  return login.username.length > 0 && login.password.length > 0
}

$(document).ready(function() {
  var authToken = cookie.get("authToken");
  if (authToken != null) {
    document.location = "/";
    return;
  }

  var usernames = values("#username")
  var passwords = values("#password")

  var usernamesAndPwds = model([usernames, passwords], ["username", "password"]);
  usernamesAndPwds.map(shouldEnableLogin).subscribe(ð.enableEl("#login"))
})
