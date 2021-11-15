const bcrypt = require('bcryptjs');
const db = require('/opt/nodejs/lib/db')
const util = require('/opt/nodejs/lib/util')

const tableName = process.env.STORAGE_TABLE;
const salt = process.env.SALT;
const sessionTokenKey = "session";

let params;
let response;

exports.handler = async(event, context) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }

    // get email and password
    const body = JSON.parse(event.body)
    const email = body.email;
    const password = body.password;

    // check if user already exists 
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

    // user exists, so check password provided with stored password 
    const isValid = await bcrypt.compare(password, userInfo.password.S);
    if (!isValid) {
        // UNAUTHORIZED: return wrong password 
        response = {
            statusCode: 401,
            body: JSON.stringify({
                message: "incorrect password."
            })
        };

        console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
        return response;
    }

    // issue new session token and store 
    const sessionToken = util.genToken();
    const dt = new Date();
    params = {
        TableName: tableName,
        Item: {
            "PK": { S: email },
            "SK": { S: sessionTokenKey },
            "sessionToken": { S: sessionToken },
            "createdDt": { S: dt.toISOString() },
        }
    };

    const result = await db.dynamodb.putItem(params).promise();
    response = {
        statusCode: 200,
        body: JSON.stringify({
            message: "user logged in successfully.",
            token: sessionToken,
        })
    };

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}