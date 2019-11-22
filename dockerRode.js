var Docker = require('./lib/docker');
var stream = require('stream');
var fs     = require('fs');

var socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
var stats  = fs.statSync(socket);

if (!stats.isSocket()) {
  throw new Error('Are you sure the docker is running?');
}

var docker = new Docker({ socketPath: socket });

docker.listContainers({all: false}, function(err, containers) {
  console.log('ALL: ' + containers.length);
  containers.forEach(containerInfo => {
  	var container = docker.getContainer(containerInfo['Id']);
  	container.stats({stream: false}, function(err, stream){
  		if(err) {
      return logger.error(err.message);
    }
    console.log(JSON.stringify(stream, null, '\t'));
  	});
    // containerLogs(container);
  });
});
