const Constants = require('../utils/Constants/response_messages')
const JWTHelper = require('../utils/Helpers/jwt_helper')
const sendgrid = require('@sendgrid/mail')

class UserService {
    constructor() {
        this.jwtObject = new JWTHelper();
    }

    async createUser(userdetails) {
        try {
            // If present in the userstatus table or users table: email already exists
            const checkInUserStatus = await global.DATA.MODELS.userstatus.findOne({
                where: {
                    emailId: userdetails.emailId
                }
            }).catch(err => {
                console.log("Error during checking user", err.message)
                throw new global.DATA.PLUGINS.httperrors.InternalServerError(Constants.SQL_ERROR)
            })

            const checkInUsers = await global.DATA.MODELS.users.findOne({
                where: {
                    emailId: userdetails.emailId
                }
            }).catch(err => {
                console.log("Error during checking user", err.message)
                throw new global.DATA.PLUGINS.httperrors.InternalServerError(Constants.SQL_ERROR)
            })

            if (checkInUsers) {
                throw new global.DATA.PLUGINS.httperrors.BadRequest("EMAIL ID ALREADY PRESENT")
            }
            if (checkInUserStatus) {
                throw new global.DATA.PLUGINS.httperrors.BadRequest("You Might Not Approved Yet !")
            }

            // User Id not present
            const password = userdetails.password;
            const confirmpassword = userdetails.confirmpassword;

            if (password !== confirmpassword) {
                throw new global.DATA.PLUGINS.httperrors.BadRequest("PASSWORDS DOES NOT MATCH")
            }

            const randomkey = await global.DATA.PLUGINS.bcrypt.genSalt(10);
            const hashedPassword = await global.DATA.PLUGINS.bcrypt.hash(password, randomkey)

            const userPayload = {
                emailId: userdetails.emailId,
                user_type: userdetails.type,
                password: hashedPassword,
                name: userdetails.name,
                status: "NV",
                role_type: userdetails.type
            }

            const newUser = await global.DATA.MODELS.userstatus.create(userPayload).catch(err => {
                console.log("Error while adding in userstatus table", err.message);
                throw new global.DATA.PLUGINS.httperrors.InternalServerError(Constants.SQL_ERROR);
            });

            return newUser;
        }
        catch (err) {
            throw err;
        }
    }

    async loginUser(userDetails) {
        try {
            const user = await global.DATA.MODELS.users.findOne({
                "where": {
                    emailId: userDetails.emailId
                }
            }).catch(err => {
                throw new global.DATA.PLUGINS.httperrors.InternalServerError(Constants.SQL_ERROR)
            })

            if (!user) {
                throw new global.DATA.PLUGINS.httperrors.NotFound("User Not Registered")
            }

            const userPassword = user.password;

            const isValid = await global.DATA.PLUGINS.bcrypt.compare(userDetails.password, userPassword);
            if (!isValid) {
                throw new global.DATA.PLUGINS.httperrors.Unauthorized("Email/Password not valid")
            }

            // Valid email and password
            const tokenPayload = user.id.toString() + ":" + user.role_type

            const accessToken = await this.jwtObject.generateAccessToken(tokenPayload);

            const refreshToken = await this.jwtObject.generateRefreshToken(tokenPayload);

            const data = {
                accessToken, refreshToken, "id": user.id, "email": user.emailId, role_type: user.role_type
            }
            return data

        }
        catch (err) {
            throw err;
        }
    }

    sendLinkToEmail(name, emailId, Link) {
        return new Promise((resolve, reject) => {
            const messageBody = {
                to: emailId,
                from: process.env.EMAIL_SENDER,
                subject: "Password Reset Request",
                html: `
                <html>
                    <head>
                        <style>
                            .button {
                                background-color: #4CAF50; /* Green */
                                border: none;
                                color: white;
                                padding: 10px 20px;
                                text-align: center;
                                text-decoration: none;
                                display: inline-block;
                                font-size: 16px;
                            }
                        </style>
                    <head>
                    <body>
                        <h2> Hello ${name}. Welcome to VRC Application </h2>
                        <p>You recently requested to reset your password for your VRC account. Use the below button to reset it. <span>
                        <b>This password reset link is only valid for the next 15 minutes.</b>
                        </span></p>
                        <p>If you did not request a password reset, please ignore this email or contact support if you have questions.
                        </p>

                        <p>
                            <a href = ${Link}> <button class = "button" > RESET YOUR PASSWORD </button> </a>
                        </p>    
                        <p>
                            Thanks, <br>
                            FINDEMY Team
                        </p>
                    </body>
                </html>
                `
            }
            sendgrid.setApiKey(process.env.EMAIL_API_KEY);
            sendgrid.send(messageBody).then(message => {
                console.log("Email Sent to the Mail");
                resolve("EMAIL SENT")
            }).catch(err => {
                console.log("Eror occured during email sending", err.message);
                reject("EMAIL NOT SENT")
            })
        })
    }

    async sendPasswordResetRequest(emailid){
        try{

            if(!emailid){
                return "EMAIL CANNOT BE EMPTY"
            }

            // check user exists or not
            const user = await global.DATA.MODELS.users.findOne({
                "where": {
                    emailId: emailid
                }
            }).catch(err => {
                throw new global.DATA.PLUGINS.httperrors.InternalServerError(Constants.SQL_ERROR)
            })

            if (!user) {
                throw new global.DATA.PLUGINS.httperrors.NotFound("User Not Registered")
            }

            // Valid email and password
            const tokenPayload = user.id.toString();

            const accessToken = await this.jwtObject.generateAccessToken(tokenPayload);

            const Link = `${process.env.RESET_BASE_URL}/${accessToken}`
            console.log(Link);

            const response = await this.sendLinkToEmail(user.name, emailid, Link);
            return response;
        }
        catch(err){
            throw err;
        }
    }

    async changePassword(token, password){
        try{
            let userId = null;
            await global.DATA.PLUGINS.jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_SECRETKEY, (err, decoded) => {
                if (err) {
                  return "INVALID LINK/LINK EXPIRED"
                } else {
                  // Access the decoded data
                  console.log('Decoded JWT data:', decoded);
                  userId = decoded.aud;
                  console.log('User ID:', userId);
                }
              });
            const newPassword = password;
            const randomkey = await global.DATA.PLUGINS.bcrypt.genSalt(10);
            const hashedPassword = await global.DATA.PLUGINS.bcrypt.hash(newPassword, randomkey)

            await global.DATA.MODELS.users.update({
                password: hashedPassword
            }, {
                where: {
                    id: userId
                }
            }).catch(err => {
                console.log("Error while updating the password", err.message);
                throw err;
            })

            return "Password Updated Successfully"

        }
        catch(err){
            throw err;
        }
    }
}
module.exports = UserService;