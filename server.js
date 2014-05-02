var express = require('express');
var app = express();

app.post('/hook', function(req, res){
    console.log(req.param('payload'));
    res.send('Hello World');
});


//
var server = app.listen(3000);
