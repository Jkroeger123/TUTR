//TODO:: is there a better way to determine if a user is a tutor or student??
//TODO:: Sign up with an array of subjects for queries
const express = require('express');
const userModel = require('./../database/userModel.js');
const tutorModel = require('./../database/tutorModel.js');
const tuteeModel = require('./../database/tuteeModel.js');

module.exports = () => {
    var router = express.Router();

        router.post("/login", (req, res) => {

            userModel.findOne({email : req.body.email})
            .then(user => {
                if(!user){
                    //no user with that email was found
                    res.status(400).send("No account found with that email");
                }else{
                    user.comparePass(req.body.psw, (err, isMatch)=>{
                        if(err) throw err;
                        if(!isMatch){
                            res.status(400).send("Wrong Password");
                        }else{
                            req.session.user = user;
                            res.status(200).redirect('/user/dashboard');
                        }
                    })
                }
            })  
    })

    router.get("/dashboard", (req,res)=>{
        if(!req.session.user){
            return res.status(400).send('Must be logged in to view this page');
        }else{
            if(req.session.user.tuteeID){
                return res.status(200).send(`Student dashboard for ${req.session.user.email}`);
            }else{
                return res.status(200).send(`Tutor dashboard for ${req.session.user.email}`);
            }
        }
    })
    
    router.post("/tutee/register", (req, res) => {

        userModel.findOne({email : req.body.email})
            .then(user => {
                if(user){   //if a user is found, an account already exists.
                    console.log(`Email ${req.body.email} already registered!`);
                    res.status(400).send("Already Registered");
                }else{      //otherwise, create the account.
                    var tutee = new tuteeModel({ 
                        first : req.body.firstName,
                        last : req.body.lastName,
                        rating: 0,
                        topics : req.body.subjects,
                        location: req.body.address
                    })
                    var user = new userModel({
                        email: req.body.email,
                        pass : req.body.psw,
                        tuteeID: tutee._id
                    })
                    tutee.save(function (err) {
                        if(err) console.log(err)
                        console.log('Saved Tutee');
                    })
                    user.save(function (err) {
                        if(err) console.log(err)
                        console.log('Saved User');
                    })
                    req.session.user = user;
                    res.status(200).redirect('/user/dashboard');
                }

            })
    })

    router.post("/tutor/register", (req, res) => {

        userModel.findOne({email : req.body.email})
            .then(user => {
                if(user){   //if a user is found, an account already exists.
                    console.log(`Email ${req.body.email} already registered!`);
                    res.status(400).send("Already Registered");
                }else{     
                     //otherwise, create the account.
                    var tutor = new tutorModel({
                        qualifications : null,
                        first : req.body.firstName,
                        last : req.body.lastName,
                        rating: 0,
                        topics : req.body.subjects,
                        location: req.body.address
                    })
                    var user = new userModel({
                        email: req.body.email,
                        pass : req.body.psw,
                        tutorID: tutor._id
                    })
                    tutor.save(function (err) {
                        if(err) console.log(err)
                        console.log('Saved Tutor');
                    })
                    user.save(function (err) {
                        if(err) console.log(err)
                        console.log('Saved User');
                    })
                    req.session.user = user;
                    res.status(200).redirect('/user/dashboard');
                }

            })
    })

    return router;    
};