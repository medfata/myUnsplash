import mongoose, { Document, Model, Query } from 'mongoose';
const { Schema } = mongoose;

interface User{
    username:string, 
    password:string
}

const userSchema = new Schema<User>({
    username:{type:String, unique:true , required:true, minLength:4},
    password:{type:String, required:true, minLength:4}

})
interface UserQueryHelpers {
    ByNameAndPassword(name: string, password:string): Query<any, Document<User>> & UserQueryHelpers;
  }

userSchema.query.ByNameAndPassword = function(name:string, password:string):Query<any, Document<User>> & UserQueryHelpers{
    return this.findOne({username:name, password});
}
export const User = mongoose.model<User, Model<User, UserQueryHelpers>>('User', userSchema);
