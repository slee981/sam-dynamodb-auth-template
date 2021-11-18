const AWS = require('aws-sdk');

const apiVersion = process.env.AWS_API_VERSION;
const REGION = process.env.REGION;
const BASE_URL = process.env.AWS_SAM_LOCAL === "true" ? "http://localhost:3000" : process.env.BASE_URL;
const FROM_ADDRESS = process.env.FROM_EMAIL_ADDRESS;
const FORGOT_PASSWORD_TEMPLATE_NAME = "ForgotPasswordEmailTemplate";

let options = {
    apiVersion: apiVersion,
    region: REGION,
}

// create client and allow for export 
const ses = new AWS.SES(options);

/*
 ** 1- send forgot password email 
 */

buildForgotPasswordEmailParams = (to, resetToken) => {
    const resetURL = `${BASE_URL}?resetToken=${resetToken}`;
    return {
        Destination: {
            CcAddresses: [],
            ToAddresses: [`${to}`, ],
        },
        Source: FROM_ADDRESS,
        Template: FORGOT_PASSWORD_TEMPLATE_NAME,
        TemplateData: `{ "RESET_URL":"${resetURL}" }`,
        ReplyToAddresses: [],
    }
}

exports.sendForgotPasswordEmail = async(email, resetToken) => {
    try {
        const params = buildForgotPasswordEmailParams(email, resetToken);
        const data = await ses.sendTemplatedEmail(params).promise();
        console.info("sent forgot password email to " + email);
        return data;
    } catch (err) {
        console.log("error", err.message);
    }
};

// 2- send changed password email 
// 3- send signup email
