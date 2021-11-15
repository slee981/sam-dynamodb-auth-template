const bcrypt = require('bcryptjs');
const db = require('/opt/nodejs/lib/db')
const util = require('/opt/nodejs/lib/util')
const { resetTokenKey } = require('/opt/nodejs/lib/util/variables.js');

const tableName = process.env.STORAGE_TABLE;
const salt = process.env.SALT;

let params;
let response;

exports.handler = async(event, context) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }

    // get email 
    const body = JSON.parse(event.body)
    const email = body.email;

    // check if user exists 
    params = {
        TableName: tableName,
        Key: {
            "PK": {
                S: email
            },
            "SK": {
                S: email
            }
        },
    };
    const userRaw = await db.dynamodb.getItem(params).promise();
    const userInfo = userRaw.Item;
    if (!userInfo) {
        // NOT FOUND: user doesn't exist 
        response = {
            statusCode: 404,
            body: JSON.stringify({
                message: "user not found."
            })
        };
        console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
        return response;
    }

    // user exists, so generate reset token and email user 
    const resetToken = util.genToken();
    const dt = new Date();
    params = {
        TableName: tableName,
        Item: {
            "PK": { S: email },
            "SK": { S: resetTokenKey },
            "resetToken": { S: resetToken },
            "createdDt": { S: dt.toISOString() },
        }
    };
    const result = await db.dynamodb.putItem(params).promise();

    //
    // TODO: implement send email 
    //
    response = {
        statusCode: 200,
        body: JSON.stringify({
            message: "email sent to user with reset link.",
        })
    };

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}