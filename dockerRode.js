var Docker = require('dockerode');
var stream = require('stream');
var fs = require('fs');

var admin = require('firebase-admin');
var serviceAccount = require("./key/dockercontainersstats-firebase-adminsdk-i1mji-2e136bb4c3.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://dockercontainersstats.firebaseio.com"
});

var db = admin.database();
var ref = db.ref("public_resource/dockercontainerstats");
var containersRef = ref.child("containers");



var socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
var stats = fs.statSync(socket);

console.log(stats);
if (!stats.isSocket()) {
    throw new Error('Are you sure the docker is running?');
}

var docker = new Docker({ socketPath: socket });
console.log(docker);


docker.listContainers({ all: false }, function(err, containers) {
    console.log('ALL: ' + containers.length);
    containers.forEach(containerInfo => {
        var container = docker.getContainer(containerInfo['Id']);
        container.stats({ stream: false }, function(err, stream) {
            if (err) {
                return logger.error(err.message);
            }
            console.log(JSON.stringify(stream, null, '\t'));
            containersRef.set(stream);
        });
        // containerLogs(container);
    });
});