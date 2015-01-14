library(rmongodb)
ontrail <- mongo.create(host="127.0.0.1", db="ontrail", username="", password="")
cursor <- mongo.find(ontrail, "ontrail.exercise",
                     query='{}',
                     limit=150000,
                     fields='{"distance":1, "duration":1, "user":1, "avghr":1}')

exs <- mongo.cursor.to.list(cursor)
f <- head(exs)
exs[0]
