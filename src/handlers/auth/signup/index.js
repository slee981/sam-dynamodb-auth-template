const bcrypt = require('bcryptjs');
const db = require('/opt/nodejs/lib/db')

const tableName = process.env.STORAGE_TABLE;
const salt = process.env.SALT;

let params;
let response;

exports.handler = async(event, context) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }

    // get email and password
    const body = JSON.parse(event.body)
    const email = body.email;
    const password = await bcrypt.hash(body.password, +salt);

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
    if (userInfo) {
        // user exists - respond as unauthorized 
        response = {
            statusCode: 403,
            body: JSON.stringify({
                message: "user already exists."
            })
        };
        console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
        return response;
    }

    // set params for user signup
    const now = new Date();
    params = {
        TableName: tableName,
        Item: {
            "PK": { S: email },
            "SK": { S: email },
            "password": { S: password },
            "createdDt": { S: now.toISOString() }
        }
    };

    const result = await db.dynamodb.putItem(params).promise();
    response = {
        statusCode: 200,
        body: JSON.stringify({
            message: "user successfully added."
        })
    };

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}