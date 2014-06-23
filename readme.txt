Live feed app, read from twitter stream API, push content to rabbitmq queue,
get feeds from queue and push them to mongodb, update the live feed view for
clients (users).

Sample parts of the project:
1. UI/sass/*
Sass files with css structure

2. UI/js/control.js
AngularJS - frontend part, control panel routing with few controllers

3. UI/js/status-manager.js
AngularJS - simple, custom module.

4. node.js
nodejs - simple server in nodejs which is responsible for status exchanges.
(scalable)

5. server.js
nodejs - main feed app server.
