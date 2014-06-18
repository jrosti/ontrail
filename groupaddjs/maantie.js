db.exercise.find({tags: " maantie"}).forEach(function(ex) {
	db.exercise.update({_id: ex._id }, { $pull: {tags: " maantie"}})
	    db.exercise.update({_id: ex._id }, { $push: {tags: "maantie"}})
	    })