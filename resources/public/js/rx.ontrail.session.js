
(function(){
  var Session = function() {}
  Session.prototype.create = function(logins, logouts) {
    return rx.create(function(observer) {
      logins.subscribe(function(login) { $.cookie("authToken", login.token, { expires: 365, domain: '.ontrail.net' }  ); $.cookie("authUser", login.username, { expires: 365, domain: '.ontrail.net' } ); observer.onNext(login.username) } )
      logouts.subscribe(function() { $.cookie("authToken", null); $.cookie("authUser", null); observer.onNext(null)})
      observer.onNext($.cookie("authUser")) // initialize with login state
      return function() {}
    })
  }
  OnTrail.session = new Session();
})()