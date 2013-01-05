export JAVA_OPTS="-Xmx820m -Xms820m"
export JAVA_TOOL_OPTIONS=-Dfile.encoding=UTF-8

function ontrailclone() {
    export LC_ALL=C
    B=`date +%s`
    ssh ontrail@ontrail.net mongodump 
    mkdir -p ontrail.dumps/$B
    scp -r ontrail@ontrail.net:dump ontrail.dumps/$B
    mongo ontrail --eval 'db.exercise.drop()'
    mongo ontrail --eval 'db.onuser.drop()'
    mongo ontrail --eval 'db.nccache.drop()'
    mongorestore $HOME/ontrail.dumps/$B/dump
}
