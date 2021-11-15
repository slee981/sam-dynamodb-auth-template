const AWS = require('aws-sdk');
let options = {
    apiVersion: '2012-08-10',
}

if (process.env.AWS_SAM_LOCAL === 'true') {
    options.region = 'localhost';
    options.endpoint = new AWS.Endpoint("http://dynamodb:8000")
}

exports.dynamodb = new AWS.DynamoDB(options);