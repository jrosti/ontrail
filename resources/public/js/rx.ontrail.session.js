
(function(){
  var Session = function() {}
  Session.prototype.create = function(logins, logouts) {
    return rx.create(function(observer) {
      logins.subscribe(function(login) { 
        Cookies.set("authToken", login.token, { expires: 365 }  );
        Cookies.set("authUser", login.username, { expires: 365 } );

        Cookies.set("authToken", login.token, { expires: 365, domain: '.ontrail.net' }  );
        Cookies.set("authUser", login.username, { expires: 365, domain: '.ontrail.net' } );
        observer.onNext(login.username) 
      } )
      logouts.subscribe(function() {
        Cookies.set("authToken", null, { domain: '.ontrail.net' });
        Cookies.set("authUser", null, { domain: '.ontrail.net' });
        Cookies.set("authToken", null);
        Cookies.set("authUser", null);
        observer.onNext(null)})
      observer.onNext(Cookies.get("authUser")) // initialize with login state
      return function() {}
    })
  }
  OnTrail.session = new Session();
})()