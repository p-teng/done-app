const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
// Load User model
const User = require("../../models/User");
const isEmpty = require("is-empty");

const adminPW = "admin123";

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
    // Form validation
    const { errors, isValid } = validateRegisterInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
        return res.status(400).json({ email: "Email already exists" });
        } else {
            let newUser = "";
            if (req.body.adminPassword === adminPW) {
                console.log("ADMIN PASSWORD: ", req.body.adminPassword);
                newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    dateOfBirth: req.body.dateOfBirth,
                    address: req.body.address,
                    photo: req.body.photo,
                    appointmentTime: req.body.appointmentTime,
                    role: "admin"
                });
                console.log("New User: ", newUser);
            } else if (!isEmpty(req.body.adminPassword)) {
                return res.status(400).json({ adminPassword: "Admin password is incorrect" });
            } else {
                newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    dateOfBirth: req.body.dateOfBirth,
                    address: req.body.address,
                    photo: req.body.photo,
                    appointmentTime: req.body.appointmentTime,
                    role: "patient"
                });
            }
            
            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                    .save()
                    .then(user => res.json(user))
                    .catch(err => console.log(err));
                });
            });
        }
    });
});


// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
    console.log("Login endpoint called", req);
    // Form validation
    const { errors, isValid } = validateLoginInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;
    // Find user by email
    User.findOne({ email }).then(user => {
    // Check if user exists
        if (!user) {
        return res.status(404).json({ emailnotfound: "Email not found" });
    }
    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
            const payload = {
                id: user.id,
                name: user.name,
                role: user.role
            };
            console.log("Payload", payload);
            // Generate jwt
            jwt.sign(
                payload,
                keys.secretOrKey,
                {
                expiresIn: 31556926 // 1 year in seconds
                },
                (err, token) => {
                res.json({
                    role: payload.role,
                    success: true,
                    token: "Bearer " + token
                });
                }
            );
        } else {
            return res
            .status(400)
            .json({ passwordincorrect: "Password incorrect" });
        }
    });
    });
});

module.exports = router;