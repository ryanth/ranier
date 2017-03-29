var ig = require('../slack/cwt_bps_codecommit_slack_notification.js');
var expect = require('Chai').expect;


var jsonPayload =
    {
        "Records": [
            {
                "awsRegion": "us-east-1",
                "codecommit": {
                    "references": [
                        {
                            "commit": "db10a424a1415b43cdbb5fe6c98ce270470a6b07",
                            "ref": "refs/heads/ryan_test"
                        }
                    ]
                },
                "eventId": "6c41ce9c-4ce3-4c6f-86d3-9bd4de6929f7",
                "eventName": "TriggerEventTest",
                "eventPartNumber": 1,
                "eventSource": "aws:codecommit",
                "eventSourceARN": "arn:aws:codecommit:us-east-1:061121813127:cwt.bps.awstest",
                "eventTime": "2017-03-28T01:25:28.022+0000",
                "eventTotalParts": 1,
                "eventTriggerConfigId": "6c41ce9c-4ce3-4c6f-86d3-9bd4de6929f7",
                "eventTriggerName": "cwt.bps.codecommit.slack.notification",
                "eventVersion": "1.0",
                "userIdentityARN": "arn:aws:iam::061121813127:user/RyanT"
            }
        ]
    };

var done, err;
before(function (cb) {
    var lambdalocal = require('lambda-local');
    //lambdalocal.setLogger(your_winston_logger);
    var lambdaFunc = require("../slack/cwt_bps_codecommit_slack_notification.js");
    //For instance, this will replace the getData content
    //sinon.mock(lambdaFunc).expects("getData").returns("MockedData");
    //see on sinonjs page for more options
    lambdalocal.execute({
        event: jsonPayload,
        lambdaFunc: lambdaFunc, //We are directly passing the lambda function
        lambdaHandler: "handler",
        callbackWaitsForEmptyEventLoop: true,
        timeoutMs: 10000,
        callback: function (_err, _done) { //We are storing the results and finishing the before() call => one lambda local call for multiple tests
            err = _err;
            done = _done;
            cb();
        }
    });
});

describe('slack', function() {
    describe('happy-path', function() {
        it('Run', function() {
            it("should return mocked value", function () {
                expect(done).equal("MockedData");
            });
        });
    });
});
