
(function(){
  var Session = function() {}
  Session.prototype.create = function(logins, logouts) {
    return rx.create(function(observer) {
      logins.subscribe(function(login) { $.cookie("authToken", login.token, { expires: 30 } ); $.cookie("authUser", login.username, { expires: 30 }); observer.onNext(login.username) } )
      logouts.subscribe(function() { $.cookie("authToken", null); $.cookie("authUser", null); observer.onNext(null)})
      observer.onNext($.cookie("authUser")) // initialize with login state
      return function() {} // todo -- should we dispose something.
    })
  }
  OnTrail.session = new Session();
})()