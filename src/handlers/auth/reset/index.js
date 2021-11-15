const bcrypt = require('bcryptjs');
const db = require('/opt/nodejs/lib/db')
const { addMinutesToTime } = require('/opt/nodejs/lib/util')
const { resetTokenKey, resetTokenLiveTime } = require('/opt/nodejs/lib/util/variables.js');

const tableName = process.env.STORAGE_TABLE;
const salt = process.env.SALT;

let params;
let response;

exports.handler = async(event, context) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }

    // get email and password
    const body = JSON.parse(event.body);
    const email = body.email;
    const newPassword = await bcrypt.hash(body.password, +salt);
    const tokenSent = event.queryStringParameters.resetToken;

    // check if user has valid reset token 
    params = {
        TableName: tableName,
        Key: {
            "PK": {
                S: email
            },
            "SK": {
                S: resetTokenKey
            }
        },
    };
    const userRaw = await db.dynamodb.getItem(params).promise();
    const userInfo = userRaw.Item;
    if (!userInfo) {
        // USER NOT FOUND
        response = {
            statusCode: 404,
            body: JSON.stringify({
                message: "user reset not found."
            })
        };
        console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
        return response;
    }

    // check stored reset token info 
    const actualResetToken = userInfo.resetToken.S;
    const createdDt = new Date(userInfo.createdDt.S);
    const expiresDt = await addMinutesToTime(createdDt, resetTokenLiveTime);

    // if token doesn't match what is stored, reject 
    if (actualResetToken !== tokenSent) {
        response = {
            statusCode: 403,
            body: JSON.stringify({
                message: "unauthorized reset: tokens don't match"
            })
        }
        console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
        return response;
    }

    // if token is expired, reject
    if (new Date() > expiresDt) {
        response = {
            statusCode: 403,
            body: JSON.stringify({
                message: "token expired"
            })
        }
        console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
        return response;
    }

    // tokens match and are valid, so set new password
    params = {
        TableName: tableName,
        Item: {
            "PK": { S: email },
            "SK": { S: email },
            "password": { S: newPassword }
        }
    };

    const result = await db.dynamodb.putItem(params).promise();
    response = {
        statusCode: 200,
        body: JSON.stringify({
            message: "user password updated successfully."
        })
    };

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}