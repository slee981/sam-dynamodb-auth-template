const AWS = require('aws-sdk');
const apiVersion = process.env.AWS_API_VERSION;
let options = {
    apiVersion: apiVersion
}

if (process.env.AWS_SAM_LOCAL === 'true') {
    options.region = 'localhost';
    options.endpoint = new AWS.Endpoint("http://dynamodb:8000")
}

exports.dynamodb = new AWS.DynamoDB(options);