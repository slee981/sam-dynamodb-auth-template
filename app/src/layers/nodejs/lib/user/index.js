const db = require('/opt/nodejs/lib/db')
const { addDaysToTime } = require('/opt/nodejs/lib/util')
const { sessionTokenLiveTime } = require('/opt/nodejs/lib/util/variables.js');

const TABLE_NAME = process.env.STORAGE_TABLE;
const SESSION_TOKEN_ATTRIBUTE = process.env.SESSION_TOKEN_ATTRIBUTE;

let params;
let response;

exports.getUser = async(headers) => {
    // session token should be passed in as an Authorization token 
    // prefixed by "Bearer"
    console.info("getting user from request headers.")
    let tokens;
    try {
        tokens = headers['Authorization'].split(" ");
        if (tokens.length != 2) {
            return {
                statusCode: 403,
                message: "incorrect authorization header."
            }
        }
    } catch {
        return {
            statusCode: 403,
            message: "authorization header not included."
        }
    }

    const token = tokens[1];
    params = {
        TableName: TABLE_NAME,
        IndexName: "SessionGSI",
        KeyConditionExpression: `${SESSION_TOKEN_ATTRIBUTE} = :sessionToken`,
        ExpressionAttributeValues: {
            ":sessionToken": { S: token }
        },
    };
    const userRaw = await db.dynamodb.query(params).promise();
    const userInfo = userRaw.Items;

    // ensure only one user returned 
    if (userInfo.length !== 1) {
        return {
            statusCode: 404,
            message: "user not found."
        }
    }

    // now we have one user. check the date 
    const user = userInfo[0];

    const createdDt = new Date(user.createdDt.S);
    const expiresDt = await addDaysToTime(createdDt, sessionTokenLiveTime);
    if (new Date() > expiresDt) {
        return {
            statusCode: 403,
            message: "session token expired, relogin."
        }
    }

    // we now have a unique valid user 
    console.info("found user from request headers.")
    return {
        statusCode: 200,
        user: {
            email: user.PK.S
        }
    }
}
