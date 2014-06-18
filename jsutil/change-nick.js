db.onuser.update( {lusername: "murakami"}, {$set: {lusername: "jsuuro"}});
db.onuser.update( {username: "Murakami"}, {$set: {username: "JSuuro"}});
db.exercise.update( {user: "Murakami"}, {$set: {user: "JSuuro"}}, {multi: true})
