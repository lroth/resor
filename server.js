var githubhook = require('githubhook');
var github = githubhook({
    port: 3000
});

github.listen();

github.on('push', function (repo, ref, data) {
    console.log(data);
});
