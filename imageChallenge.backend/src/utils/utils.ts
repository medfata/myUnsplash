import { imagesPath } from './../app';
import  mongoose  from "mongoose";
import fs, { write } from 'fs';
import path from 'path';
import axios from 'axios';

export const getDate = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

return  dd + '/' + mm + '/' + yyyy;
}

export const validateObjectId = (Id:string) : boolean => {
    
    if(Id && mongoose.Types.ObjectId.isValid(Id)){
        let castedId = new  mongoose.Types.ObjectId(Id);
        if(castedId.toString() === Id){
            return true
        }
    }

    return false;
}

export const  downloadImage = async function(uri:string){  
    const response = await axios({url:uri, method:'GET', responseType:'stream'});
    const contetnType : string = response.headers['content-type'];
    const uriParts = uri.split('/');
    if(contetnType.startsWith('image')){
        const uriLastPart = uriParts[uriParts.length - 1];
        const writeImage = fs.createWriteStream(imagesPath+'/'+uriLastPart);
        response.data.pipe(writeImage);
        return new Promise((resolve:any, reject:any) => {
            writeImage.on('error', reject);
            writeImage.on('finish', resolve);
        })
    }else{
        return Promise.reject('file is not an Image ! ');
    }



   
};