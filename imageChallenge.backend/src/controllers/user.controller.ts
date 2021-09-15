import { User } from "../models/user.Model";
import express = require("express");
import {body, validationResult} from "express-validator";

// exports.userByUsernameAndPassword = function(req:any, res:any, next:any){
//     let username = req.query.username;
//     let password = req.query.password;
//     const query =  User.findOne({username, password});
//     query.exec(function(err:any, result:any){
//         if(err){res.next(err)};
//         res.json(result);
//     })
// }

exports.saveUser = function(req:express.Request, res:express.Response, next:express.NextFunction){
const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let newUser = new User(
        {
            username:req.body.username,
            password:req.body.password
        }
    );
    newUser.save(function(err){
        if(err){return next(err)}

        res.status(200).json(newUser);
    })
}
exports.login = async function(req:express.Request, res:express.Response, next:express.NextFunction){
    let userName = req.body.username;
    let password = req.body.password;

 
   let user =  await  User.findOne().ByNameAndPassword(userName, password);
   console.log(user);
    if(user){
        res.status(200).json(user);
    }else{
        res.sendStatus(403)
    }
}