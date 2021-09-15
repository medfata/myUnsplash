import mongoose from "mongoose";
const {  Schema  } = mongoose;


const imageSchema =  new Schema({
    name:{type:String, required:true},
    url:{type:String, required:true},
    date:{type:Date, required:true},
    description:String,
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
})

export const Image = mongoose.model('Image', imageSchema);