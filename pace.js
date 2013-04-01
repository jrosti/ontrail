db.exercise.find().forEach(function (data) {
	var pace = Math.round(data.distance / data.duration * 360000)
	if (pace) {
		db.exercise.update({_id: data._id}, {$set: {pace: NumberInt(pace)}})
	}
})