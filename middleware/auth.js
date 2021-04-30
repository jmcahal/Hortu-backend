"use strict";
const passport = require("passport");
const { UnauthorizedError } = require("../expressError");

// Middleware to insure user is an admin.
function ensureAdmin(req, res, next) {
  if(req.isAuthenticated() && req.user.isAdmin){
    return next();
  };
  res.redirect('/plants');
}

function checkAuthenticated (req,res,next){
  if(req.isAuthenticated()){
    return next();
  };
  res.redirect('/login')
}

function checkNotAuthenticated (req,res,next){
  if(req.isAuthenticated()){
   return res.redirect('/')
  };
  next();
}

module.exports = { ensureAdmin, 
                  checkAuthenticated, 
                  checkNotAuthenticated 
                };

