const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./models/user');

function initialize(passport) {
    const authenticateUser =  async(username, password, done) => {
        const user = User.authenticate(username, password) ;
        console.log(user);
        if (user == null) {
            return done(null, false, {message: 'No user with that username'})
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: "passoword incorect"})
            }
        } catch(e){
            done(e);
        }
    }

    passport.use(new LocalStrategy({passReqToCallback: true}, authenticateUser));
    passport.serializeUser((user, done) => done(null, user.username));
    passport.deserializeUser(async(username, done) => {
        const user = await User.get(username);
        done(null, user);
    });
}

module.exports = initialize;