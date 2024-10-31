const  mongoose=require('mongoose');

//definir le schema user
const UserSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String
        
    },
    
});
//creer un model base sur schema
const User=mongoose.model('User',UserSchema);

module.exports=User;
