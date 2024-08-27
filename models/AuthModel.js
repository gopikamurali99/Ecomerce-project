const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique: true},
    phone: { type: String, unique: true },
    password:{type:String, required:true},
    role:{type:String, enum:['admin','seller','customer'],required:true},
    isVerified:{type:Boolean,default:false},
    verificationToken:{type:String},
    resetToken:{type:String},
    resetTokenExpiration:{  type:Date
    },

},{timestamps:true}
)

module.exports =mongoose.model('user',UserSchema);

