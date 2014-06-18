db.exercise.find({tags: "pk/vk13"}).forEach(function(ex) {
	db.exercise.update({_id: ex._id }, { $pull: {tags: "pk-vk13"}})
	db.exercise.update({_id: ex._id }, { $push: {tags: "pk-vk13"}})
})