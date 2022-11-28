
const Models = require('../database/DB').Models;
const passportJWT = require('passport-jwt');
let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;

let jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    algorithms: ['HS256'],
    expiresIn: Number(process.env.SECRET_EXP)
};


// lets create our strategy for web token
let strategy = new JwtStrategy(jwtOptions, async function (jwt_payload, done) {
    console.log(jwt_payload);
    try {
        console.log(jwt_payload);

        let ssoUser = await isSSOuser({ PK_USER: jwt_payload.name });
        let userUsed;
        if (!!ssoUser && !!ssoUser.dataValues) {
            if (ssoUser.dataValues.sso) {
                userUsed = ssoUser;
            } else {
                userUsed = await getUser({ PK_USER: jwt_payload.name });
            }
        }
        
        if (userUsed) {
            done(null, userUsed);
        } else {
            done(null, false);
        }
    } catch (error) {
        console.log(error)
    }

});

const getUser = async obj => {
    return await Models.Users.findOne({
        where: obj,
    });
};

const isSSOuser = async obj => {
    return await Models.Users.findOne({
        where: obj,
    });
};

module.exports = {
    strategy,
    jwtOptions
}