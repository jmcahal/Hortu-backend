# HORTU

This project is currently in development. 

### Horticulture made personal:

Hortu is a home gardening journal, network, and reference resource.
Within this app users can explore, post, and share information about growing plants in their home garden. 

## Stack

This repository is the backend stack made with node.js and express for the frontend of the Hortu App.

## Features

### passport

the passport middleware is used for basic authentication for users. Currently users login with username and password for the app. However, login with Facebook and Google is in development. 

### cloudinary

In order to cut down on the amount of data stored directly to the database and in hopes of allowing the app to scale smoothly in the future cloudinary is used to store photos. When a user uploads an image that image is stored to cloudinary and the public url link provided by cloudinary is stored to the database. Cloudinary has other features that will allow greater visual dynamics in future updates of the applicaiton. 

### postgreSQL

PostgreSQL is the relational databased currently used for the app. 