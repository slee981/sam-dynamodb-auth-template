const db = require('/opt/nodejs/lib/db')
const util = require('/opt/nodejs/lib/util')
const { getUser } = require('/opt/nodejs/lib/user')

const tableName = process.env.STORAGE_TABLE;
const SESSION_TOKEN_ATTRIBUTE = process.env.SESSION_TOKEN_ATTRIBUTE;

let params;
let response;

exports.handler = async(event, context) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`only accepts GET method, you tried: ${event.httpMethod} method.`);
    }

    // no body
    // check header for user session token and lookup user 
    const user = await getUser(event.headers);

    // if (!userInfo) {
    //     // NOT FOUND: user doesn't exist 
    //     response = {
    //         statusCode: 404,
    //         body: JSON.stringify({
    //             message: "user not found."
    //         })
    //     };
    //     console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    //     return response;
    // }

    // // user exists, so generate reset token and email user 
    // const resetToken = util.genToken();
    // const dt = new Date();
    // params = {
    //     TableName: tableName,
    //     Item: {
    //         "PK": { S: email },
    //         "SK": { S: resetTokenKey },
    //         "resetToken": { S: resetToken },
    //         "createdDt": { S: dt.toISOString() },
    //     }
    // };
    // const result = await db.dynamodb.putItem(params).promise();

    // //
    // // TODO: implement send email 
    // //
    // const sendEmailResult = await sendForgotPasswordEmail(email, resetToken);
    response = {
        statusCode: 200,
        body: JSON.stringify({
            message: user,
        })
    };

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
