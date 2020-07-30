const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretOrKey = require('../../config/keys').secretOrKey;
const passport = require('passport');

// Load Input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// User model loaded
const User = require('../../models/User');

// @route   GET /api/users/test
// @desc    test users route
// @access  Public
router.get('/test', (req,res)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json({
        "Username":"Hello",
        "Message": "World"
    })
});

// @route   POST /api/users/register
// @desc    Register User
// @access  Public
router.post('/register',(req,res,next)=>{

    const { errors, isValid } = validateRegisterInput(req.body);

    //Check Validation
    if(!isValid){
        return res.status(400).json(errors);
    }

    // Check for whitelisted emails
    if (whiteListEmails.indexOf(req.body.email) === -1) {
        errors.email = "Your email is not allowed to register on this platform.";
        return res
        .status(400)
        .json(errors);
    }

    User.findOne({ email: req.body.email })
    .then((user)=>{
        if(user){
            errors.email = 'Email already exists.';
            return res.status(400).json(errors);
        }else{
            let avatar = gravatar.url(req.body.email,{
                s:'200', //Size
                rating: 'r',
                d: 'identicon'
            });
            let newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                avatar
            });

            bcrypt.genSalt(10, (err,salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err){
                        throw err;
                    }else{
                        newUser.password = hash;
                        newUser.save()
                        .then((user)=>{
                            res.json(user);
                        })
                        .catch((err)=>console.log(err));
                    }
                })
            });
        }
    })
    .catch(err=>console.log(err));
});

// @route   POST /api/users/login
// @desc    User Login (Returns JWT)
// @access  Public
router.post('/login',(req,res)=>{

    const { errors,isValid } = validateLoginInput(req.body);

    if(!isValid){
        return res.status(400).json(errors);
    }

    let email = req.body.email;
    let password = req.body.password;

    User.findOne({ email })
    .then((user)=>{

        //Check if user exists
        if(!user){
            errors.email = "Email not found.";
            return res.status(404).json(errors);
        }

        //Check password
        bcrypt.compare(password, user.password)
        .then((isMatch)=>{
            if(isMatch){
                // User matched

                //JWT payload
                let payload = {
                    id: user._id,
                    name: user.name,
                    avatar: user.avatar
                }

                // sign token
                jwt.sign(payload ,
                    secretOrKey ,
                    { expiresIn: 3600 },
                    (err,token) => {
                        res.json({
                            success: true,
                            token: 'Bearer ' + token
                        })
                });
            }else{
                errors.password = "Incorrect password.";
                return res.status(400).json(errors);
            }
        })
    })
    .catch((err)=>console.log(err));
});

// @route   GET /api/users/current
// @desc    returns current user
// @access  Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req,res) => {

    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.name
    });
});

module.exports = router;