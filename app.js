const express = require('express');
const cors = require("cors");
const morgan = require("morgan");
const { NotFoundError } = require("./expressError");

const plantRoutes = require("./routes/plants");
const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");
const photoRoutes = require("./routes/photos");

// const fetch = require('node-fetch');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.urlencoded({extened: true}));

app.use("/plants", plantRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/photos", photoRoutes);

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
