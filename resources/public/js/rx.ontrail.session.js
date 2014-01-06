
(function(){
  var Session = function() {}
  Session.prototype.create = function(logins, logouts) {
    return rx.create(function(observer) {
<<<<<<< HEAD
      logins.subscribe(function(login) { $.cookie("authToken", login.token, { expires: 365 }  ); $.cookie("authUser", login.username, { expires: 365 } ); observer.onNext(login.username) } )
=======
      logins.subscribe(function(login) { $.cookie("authToken", login.token, { expires: 30 } ); $.cookie("authUser", login.username, { expires: 30 }); observer.onNext(login.username) } )
>>>>>>> charts
      logouts.subscribe(function() { $.cookie("authToken", null); $.cookie("authUser", null); observer.onNext(null)})
      observer.onNext($.cookie("authUser")) // initialize with login state
      return function() {} // todo -- should we dispose something.
    })
  }
  OnTrail.session = new Session();
})()