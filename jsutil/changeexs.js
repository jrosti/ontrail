db.exercise.find({user: "Elmo"}).forEach(function(data) { 
	db.exercise.update({_id: data._id}, {$set: {user: "Hopo"} })
	    })