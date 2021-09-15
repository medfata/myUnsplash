import { validateObjectId } from './../utils/utils';
import {  Image } from "../models/image.Model";
import { User } from '../models/user.Model';
import express, { Response } from "express";
import fs from 'fs';
import path from 'path';
import { downloadImage } from './../utils/utils';
import { imagesPath } from '../app';


const validateRequest = (req:any): boolean =>{
    const ownerid = req.headers['ownerid'] || undefined;
    return validateObjectId(ownerid);
}


export  function getAllImagesOfOwner(req:any, res:express.Response, next:express.NextFunction){
    const validObjectId = validateRequest(req);
    const ownerid = req.headers['ownerid'] || undefined;
    if(validObjectId){
        Image.find({owner:ownerid}, (err:any, images:any) => {
            if(err){
                next(err);
            }
            res.json(images);
        })
    }else{
        res.sendStatus(400);
    }

}

export function getImageByName(req:any, res:express.Response, next: express.NextFunction){
    const validateObjectId = validateRequest(req);
    const ownerid = req.headers?.ownerid || undefined;
    const nameTerm = req.params?.labelTerm || '';

    if(validateObjectId){
        console.log(nameTerm)
        Image.find({owner:ownerid, name: {'$regex': nameTerm} }, (err:any, images:any) => {
            if(err){
                next(err);
            }
            res.status(200).json(images);
        })
    }else{
        res.sendStatus(400);
    }
}




export async function uploadImage(req:any, res:express.Response, next: express.NextFunction){
    const imageUrl = req.body.imageUrl;
    const label = req.body.label;
    const validObjectId = validateRequest(req);
    const ownerid = req.headers['ownerid'] || undefined;
    // console.log(ownerid, req.headers)
    
    if(imageUrl && label && validObjectId ){
        try{
            const imageWithSameUrl = await Image.findOne({url:imageUrl, owner:ownerid});
            console.log(imageWithSameUrl)
            if(imageWithSameUrl){
                res.status(400).send('image with same url already exists !');
            }else{
                const newimage  = new Image({
                    name: label,
                    url: imageUrl,
                    date: new Date(),
                    description: req.description || '',
                    owner: ownerid
        
                })
                
                downloadImage(imageUrl)
                .then(() => {
                    newimage.save().then( (value: any) =>
                        res.status(201).json()
                    ).catch(err =>
                        res.status(400).send('error while getting image !')
                    )
                })
                .catch(err =>{
                    res.status(400).send('error while getting image !')
                });
            }
        }catch(err){}
       

    }else{
        res.sendStatus(400);
    }
    
}

export async function deleteImage(req:any, res:express.Response, next:express.NextFunction){
    //check ownerid header && body.password && body.imageName
    const ownerid = req.headers['ownerid'] || undefined;
    const imageId = req.body.imageId;
    const ownerPassword = req.body.password;
    const validObjectId = validateRequest(req);
    if(validObjectId && ownerPassword && imageId){
        const image = await Image.findOne({_id:imageId, owner:ownerid});
        const userByPassword = await User.findOne({_id:ownerid,  password:ownerPassword});
        let localImagePath = imagesPath+'/'+image.url.split('/')[image.url.split('/').length - 1];
        console.log(image, userByPassword, localImagePath);
        if (!userByPassword) {
            res.status(400).send('password not valid !');
            return
            }
        if(!image){
            res.status(400).send('image not found !');
            return
        }
        fs.unlink(localImagePath, (err) => {
            if(err){
                res.status(400).send("server can't delete image !");
                console.log(err)
                return
            }
            Image.deleteOne({name:image.name, owner:image.owner}, (err) => {
                if(err){
                    res.status(400).send('error while deleting image Info from db !');
                    console.log(err)
                    return
                }
                res.status(201).json();
            })
        })
    }else{
        res.sendStatus(400);
    }
    
}
