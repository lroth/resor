var express = require('express');
var app = express();

app.post('/hook', function(req, res){
    console.log(req);
    res.send('Hello World');
});


//
var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
