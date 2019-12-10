# docker-containers-stats
React webpage showing Docker containers stats.

# Libraries

[Firebase] (https://www.npmjs.com/package/firebase)
[React-rt-char](https://www.npmjs.com/package/react-rt-chart)

# Configuration

To be able to run this project, you need a config file for Firebase - on the backend and frontend. 

For the backend: 
- You need to change the serviceAccount location in the [DockerRode.js](https://github.com/lfp2/docker-containers-stats/blob/master/dockerRode.js) file.

For the frontend:
- You need to add a React file named config in this [location](https://github.com/lfp2/docker-containers-stats/tree/master/docker-stats-front/src) importing Firebase and your project details.
