// 79.184.55.230
var restify = require('restify');
var Trello  = require("node-trello");

var server = restify.createServer();
var t = new Trello("a4a1fbde221d3ab65ef9235422177a7a", "52919f107834d602dd03ae6a5cf9cca2a5259b4dfc3e39cfbe3e6c1eac197334");

var boardId = 'lX34SxNJ';

// t.get("/1/boards/" + boardId + "/lists", function(err, list) {
//     for (var i = 0; i < list.length; i++) {
//           var user = list[i];
//           console.log(user.name);
//     }
// });

t.get('/1/webhooks', function(data) {
    console.log(data);
});

function respond(req, res, next) {
  console.log(req.params);
  res.send(200);
  return next();
}

server.get('/hello/:name', respond);
server.post('/action/^\/([a-zA-Z0-9_\.~-]+)\/(.*)/', respond);

t.post("/1/tokens/webhooks", {
  description: "My first webhook",
  callbackURL: "http://79.184.55.230:3000/action",
  idModel: "lX34SxNJ",
}, function(data) { console.log(data) });


server.listen(3000, function() {
  console.log('%s listening at %s', server.name, server.url);
});

/*
      users: [
        {
          id: 1,
          name: 'Lukasz Roth',
          "tasks": [
            {
              "id": "308484",
              "name": "urlop",
              "user_id": "18151",
              "project_id": "32884",
              "block_start_date": "2014-04-21",
              "block_start_doy": "111",
              "block_end_doy": "115",
              "block_end_date": "2014-04-25",
              "block_len": "4",
              "hours_pd": "8.0",
              "total_hours": "72.0",
              "project_name": "Personal Time Off"
            }
          ]
        },
        {id: 2, "tasks": [], name: 'Michał Soczyński'},
        {id: 3, "tasks": [], name: 'Krzysztof Proszkiewicz'},
        {id: 4, "tasks": [], name: 'Adam Misiorny'},
        {id: 5, "tasks": [], name: 'Radek Szczepaniak'},
        {id: 6, "tasks": [], name: 'Leszek Pawlak'},
        {id: 7, "tasks": [], name: 'Marek Murawski'}
      ],
*/


// var http   = require('http');
// var sockjs = require('sockjs');

// var echo = sockjs.createServer();
// echo.on('connection', function(conn) {
//     conn.on('data', function(message) {
//         conn.write(message + ' from socket');
//     });
//     conn.on('close', function() {});
// });

// var server = http.createServer();
// echo.installHandlers(server, {prefix:'/echo'});
// server.listen(9999, '0.0.0.0');
