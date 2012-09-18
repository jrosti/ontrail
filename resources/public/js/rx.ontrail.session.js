
(function(){
  var Session = function() {}
  Session.prototype.create = function(logins, loginFails, logouts) {
    return rx.create(function(observer) {
      logins.subscribe(function(login) { $.cookie("authToken", login.token ); $.cookie("authUser", login.username); observer.onNext(login.username) } )
      logouts.mergeTo(loginFails).subscribe(function() { $.cookie("authToken", null); $.cookie("authUser", null); observer.onNext(null)})
      observer.onNext($.cookie("authUser")) // initialize with login state
      return function() {} // todo -- should we dispose something.
    })
  }
  OnTrail.session = new Session();
})()