const passport = require('passport');
const passportJWT = require('passport-jwt');
const models = require('../models');
const llave = require('./llave');

let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = llave;

let strategy = new JwtStrategy(jwtOptions, async function (jwt_payload, next) {
    let user = await models.User.findByPk(jwt_payload.id);
    if (user) {
        next(null, user);
    } else {
        next(null, false);
    }
});

//Usa la estrategia
passport.use(strategy);

module.exports = passport;