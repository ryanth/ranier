console.log('Loading function');
const https = require('https');
const url = require('url');
const slack_url = 'https://hooks.slack.com/services/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';
const slack_req_opts = url.parse(slack_url);
slack_req_opts.method = 'POST';
slack_req_opts.headers = {
    'Content-Type': 'application/json'
};

function callSlack(slack_req_opts, context) {
    var req = https.request(slack_req_opts, function (res) {
        if (res.statusCode === 200) {
            context.succeed('posted to slack');
        } else {
            context.fail('status code: ' + res.statusCode);
        }
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        context.fail(e.message);
    });

    //req.write();
    req.end();
}

function createSlackAttachment(rec) {
    var git_project = rec.eventSourceARN.substring(rec.eventSourceARN.search("(:)(?!.*:)") + 1);
    var git_user = rec.userIdentityARN.split("/")[1];

    var params = {
        attachments: [
            {
                fallback: ("Project: " + git_project + "\nUser: " + git_user),
                pretext: "Release [Start]",
                color: "#15D032",
                fields: [
                    {
                        title: "Project",
                        value: git_project,
                        short: true
                    },
                    {
                        title: "User",
                        value: git_user,
                        short: true
                    }
                ]
            }
        ]
    };
    return JSON.stringify(params);
}

exports.handler = function (event, context) {
    if (event.Records) {
        event.Records.forEach(function (rec) {
                if (rec.codecommit) {
                    var payload = createSlackAttachment(rec);
                    callSlack(slack_req_opts, context, payload);
                }
            }
        );
    } else {
        context.done(event, context);
    }
};