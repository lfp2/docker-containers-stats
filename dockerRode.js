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


var socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
var stats = fs.statSync(socket);

if (!stats.isSocket()) {
    throw new Error('Are you sure the docker is running?');
}

var docker = new Docker({ socketPath: socket });

let sendDataToFirebase = () => {
    docker.listContainers({ all: false }, function(err, containers) {
        console.log('ALL: ' + containers.length);
        containers.forEach(containerInfo => {
            var container = docker.getContainer(containerInfo['Id']);
            container.stats({ stream: false }, function(err, stream) {
                if (err) {
                    return logger.error(err.message);
                }
                var ref = db.ref("docker-infos/containers/" + stream.name);

                let child = JSON.stringify(stream.read);
                let dot = child.indexOf('.');
                child = child.substring(1, dot);
                var containersRef = ref.child(child);
                containersRef.set(stream);
            });
            // containerLogs(container);
        });
    });
    console.log("Dados enviados, em 30s serão enviados de novo");
}

sendDataToFirebase();
setInterval(function() {
    sendDataToFirebase();
}, 30000);