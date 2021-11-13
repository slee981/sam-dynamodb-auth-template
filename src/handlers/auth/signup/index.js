// Get the DynamoDB table name from environment variables

const bcrypt = require('bcryptjs');
const AWS = require('aws-sdk');
let options = {
    apiVersion: '2012-08-10',
}

if (process.env.AWS_SAM_LOCAL === 'true') {
    options.region = 'localhost';
    options.endpoint = new AWS.Endpoint("http://dynamodb:8000")
}

const dynamodb = new AWS.DynamoDB(options);
const tableName = process.env.STORAGE_TABLE;
const salt = process.env.SALT;

exports.signupHandler = async(event, context) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);

    // Get id and name from the body of the request
    const body = JSON.parse(event.body)
    console.log("body: ", body)

    const email = body.email;
    const password = await bcrypt.hash(body.password, +salt);

    // Creates a new item, or replaces an old item with a new item
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
    var params = {
        TableName: tableName,
        Item: {
            "PK": { S: email },
            "SK": { S: email },
            "password": { S: password }
        }
    };

    const result = await dynamodb.putItem(params).promise();
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: "user successfully added."
        })
    };

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}