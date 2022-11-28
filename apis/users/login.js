const uuid = require('uuid').v4
const bcrypt = require('bcrypt')
const Models = require('../../database/DB').Models

const logger = require('../../Logger/winstonLogger').logger
const loggingPolicy = require('../../Logger/loggingPolicy').loggingPolicy
const jwt = require('jsonwebtoken')
const jwtOptions = require('../../configs/passport-jwt.config').jwtOptions
const apiName = 'login'

module.exports = async(req, res) => {
    try {
        logger.info(
            `Code: ${loggingPolicy.functionEnter.code} ${apiName} ${loggingPolicy.functionEnter.message}`
        )

        if (!req.body.username) {
            logger.error(
                `Code: ${loggingPolicy.missingParameters.code}, ${apiName} ${loggingPolicy.missingParameters.message}`
            )
            res.status(400).send({ message: 'No username parameter was provided' })
        } else if (!req.body.password) {
            logger.error(
                `Code: ${loggingPolicy.missingParameters.code}, ${apiName} ${loggingPolicy.missingParameters.message}`
            )
            res.status(400).send({ message: 'No password parameter was provided' })
        } else {
            let user = await getUser({ PK_USER: req.body.username })
            if (!user) {
                logger.error(
                    `Code: ${loggingPolicy.unauthorized.code}, ${apiName} ${loggingPolicy.unauthorized.message}`
                )
                return res.status(401).send({
                    message: 'User Authentication Failed. No such User found',
                    user
                })
            }
            var email = user.EMAIL

            if (bcrypt.compareSync(req.body.password, user.PASSWORD)) {
                let payload = { name: user.PK_USER }
                let token = jwt.sign(payload, jwtOptions.secretOrKey, {
                    expiresIn: 10000000000
                })
                let data = {
                    message: 'Successful User Authentication',
                    token: token,
                    user: user.PK_USER,

                }

                // Get Last Login
                // var lastLogin = await Models.UserLogHistory.findOne({
                //   attributes: ['LOGIN_DATE'],
                //   where: { FK_USERNAME: req.body.username }
                // })
                // if (!lastLogin) {
                //   lastLogin = await Models.UserLogHistory.create({
                //     PK: uuid(),
                //     EVENT: 'UserLogin',
                //     LOGIN_DATE: Date.now(),
                //     FK_USERNAME: req.body.username
                //   })
                // }

                // // Get Last Password change
                // var lastPasswordChange = await Models.UserPassHistory.findOne({
                //   attributes: ['UPDATED_AT'],
                //   where: { USER: req.body.username }
                // })
                // if (!lastPasswordChange) {
                //   lastPasswordChange = await Models.UserPassHistory.create({
                //     PK: uuid(),
                //     USER: req.body.username,
                //     UPDATED_AT: Date.now()
                //   })
                // }

                // if (lastLogin && lastPasswordChange) {
                //   //Check Reset password period
                //   var timeWithCurrentPassword = Math.round(
                //     (Date.now() - lastPasswordChange.UPDATED_AT) / (1000 * 60 * 60 * 24)
                //   )

                //   const resetPasswordPeriod = require('../../configs/application.config')
                //     .PasswordPolicies.resetPasswordPeriod
                //   if (timeWithCurrentPassword > resetPasswordPeriod) {
                //     var password = String(Math.floor(Math.random() * 1000000000))
                //     let hashedPassword = bcrypt.hashSync(password, 10)
                //     let user = await Models.Users.update(
                //       { PASSWORD: hashedPassword, STATUS: 'RESET' },
                //       { where: { PK_USER: req.body.username } }
                //     )

                //     if (user) {
                //       //Get email template and replace placeholders
                //       const emailTemplate = require('../../templates/email.templates')
                //         .resetUserPassword
                //       message = emailTemplate.createEmail({
                //         password,
                //         url: process.env.CLIENT_URL + '/users/reset'
                //       })

                //       //Send email
                //       SES.sendEmail([email], 'Temporary password', message)
                //       logger.info(
                //         `Code: ${loggingPolicy.successQuery.code},${apiName} ${loggingPolicy.successQuery.message} forgot Password`
                //       )
                //       return res.status(403).send({
                //         message:
                //           'Your password has expired, please use the password in your emails for recovery'
                //       })
                //     } else {
                //       logger.error(
                //         `Code: ${loggingPolicy.catchError.code}, ${apiName} ${loggingPolicy.catchError.message}`
                //       )
                //       return res
                //         .status(404)
                //         .send({ message: 'Wrong User Name or Email' })
                //     }
                //   }
                // }

                return res.status(200).send(data)
            } else {
                logger.error(
                    `Code: ${loggingPolicy.unauthorized.code},${apiName} ${loggingPolicy.unauthorized.message}`
                )
                return res.status(401).send({ message: ' Incorrect Password' })
            }
        }
    } catch (err) {
        logger.error(
            `Code: ${loggingPolicy.catchError.code},${apiName} ${loggingPolicy.catchError.message}`
        )
        return res
            .status(400)
            .send({ message: 'Sorry, something went wrong: ' + err })
    }
}

const getUser = async obj => {
    return await Models.Users.findOne({
        where: obj
    })
}