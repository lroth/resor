var githubhook = require('githubhook');
var github = githubhook({
    port: 3000
});

github.listen();

github.on('push', function (repo, ref, data) {
    //get Trello board id from repository description
    var TrelloBoardId = data.repository.description;
    //for each commit
    for (var i = 0; i < data.commits.length; i++) {
        var commit = data.commits[i]
        //get Trello card id from commit message
        var TrelloCardId = commit.message;
        // commit.timestamp, commit.author.name

        //Try to update the Trello card and move it to "Done"
    };
});
