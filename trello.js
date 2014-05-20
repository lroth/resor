var Trello = require("node-trello");
var t = new Trello("a4a1fbde221d3ab65ef9235422177a7a", "52919f107834d602dd03ae6a5cf9cca2a5259b4dfc3e39cfbe3e6c1eac197334");

var boardId = "7I4eOEV5";
var cardId  = "cpGT5uiH";

t.get("/1/boards/" + boardId + "/lists", function(err, data) {
    // we have btn users here, get their active projects
    for (var i = 0; i < data.length; i++) {
        if (data[i].name == 'Done') {
            var doneListId = data[i].id;
            //post comment
            t.post('/1/cards/' + cardId + '/actions/comments', {text: 'Test comment'}, function() {
                //move to done
                t.put('/1/cards/' + cardId, {idList: doneListId}, function() { console.log('done') });
            });
        };
    }
});


