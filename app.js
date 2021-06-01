const express = require('express');
const cors = require("cors");
const morgan = require("morgan");
const { NotFoundError } = require("./expressError");
const { urlencoded, json } = require('body-parser');

const cloudinary = require('cloudinary').v2;
const {CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_NAME } = require('./config');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const plantRoutes = require("./routes/plants");
const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");
const photoRoutes = require("./routes/photos");
const journalRoutes = require("./routes/journals");
 
const db = require('./db');
const app = express();

app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(morgan("tiny"));
app.use(express.urlencoded({limit:'50mb', extended: true}));
app.use(urlencoded({extended: true}));
app.use(json());

//session-related libraries
const session = require("express-session");
const passport = require("passport"); //This is used for authentication
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");


//Setting up our session
const { SECRET_KEY } = require('./config');

app.use(session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: false
}));

//initializing our session
app.use(passport.initialize());
app.use(passport.session()); //Telling our app to use passport for dealing with our sessions

app.use("/plants", plantRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/photos", photoRoutes);
app.use("/journals", journalRoutes);

//setting up our local strategy
passport.use('local', new LocalStrategy({passReqToCallBack: true},( username, password, cb )=> {
    console.log("this is being executed");
    db.query(`SELECT id, username, password,  is_admin AS "isAdmin" FROM users where username=$1`, [username], (err, result) => {
        if(err){
            return cb(err);
        }
        if(result.rows.length > 0){
            const first = result.rows[0];
            bcrypt.compare(password, first.password, (err, res) => {
                if(res){
                    cb(null, {
                        id: first.id,
                        user: first.username,
                        isAdmin: first.isAdmin
                    })
                }
                else {
                    cb(null, false);
                }
            })
        }
        else {
            cb(null, false);
        }
    })
}));

passport.serializeUser(function(user, done){
    console.log("serialize user is executing")
    done(null, user.id);
})

passport.deserializeUser(function(id, done){
    db.query(`SELECT id, username, is_admin AS "isAdmin" FROM users WHERE id = $1`, [parseInt(id, 10)], (err, results) => {
        if(err) {
          return done(err)
        }

        done(null, results.rows[0])
    });
});

app.post("/login", passport.authenticate('local'), (req, res, next) => {
    
    console.log(` response: ${req.user.user}`);
    console.log(req.session);
    console.log('Cookies: ', req.session.passport)
    // make sure to respond to the request
    res.json(req.user.user);
})

app.get('/logout', function (req, res){
    console.log("logging out");
    req.logOut();
    console.log("logged out");
    res.redirect('/')
});

app.get("/", (req, res) => {
    res.json({message: "hey! This is your server response!"})
});

// image upload API
app.post("/upload-image",async(req, res) => {
    try{
        const fileStr = req.body.data;
        const uploadedResponse = await cloudinary.uploader.upload(fileStr)
        console.log(uploadedResponse);
        res.json(uploadedResponse);
    }catch(e){
        console.log(e);
        res.status(500);
    }
});

// Handle 404 errors
app.use(function (req, res, next){
    return next(new NotFoundError())
});

// Generic error handler for anything unhandled.
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: {message, status},
    });
});

module.exports = app;
