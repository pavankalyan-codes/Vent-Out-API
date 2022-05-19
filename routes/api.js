if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }  
const express =require('express')
const router = express.Router()

const TokenGenerator = require('uuid-token-generator');


const User =require('../models/User')

const mongoose = require('mongoose')

const Messages = require('../models/Messages')
const db=process.env.DB_URL
const tokgen = new TokenGenerator(256, TokenGenerator.BASE62); // Default is a 128-bit token encoded in base58




mongoose.connect(db,err =>{
    if(err){
        console.log("Error",er)
        
    }else{
        console.log('Connected to mongodb');
        console.log(process.env.NODE_ENV)
        
    }
})





router.get('/',(req,res) => {
    res.send('From API route')
})


router.post("/register", (req, res) => {
  let name = req.body.name;

  if ((name == null) | (name.trim() == ""))
    return res.send(404).send("Unable to process your request");

  let userProfile = new Messages();
  userProfile.name = name;
  userProfile.messages = [];
  userProfile.save(function (err, result) {
    if (err) 
        return res.status(404).send("Unable to process your request1"+err);
    let user=new User;
    user._id=tokgen.generate()
    user.Vents=result._id;
    user.save(function (err, result) {
      if (err) 
        return res.status(404).send("Unable to process your request"+err);
      let jsonToken = result._id;
      return res.status(200).send({token:jsonToken,msgId:result.Vents});
    });
  });
});

function insertIdUsers(id)
{
    let user=new User();
    user.Vents=id
    User.save(user,function(err,result) {
        if(err)
            return res.status(404).send("Unable to process your request");
        let jsonToken=result._id
        return jsonToken;
    })
}



router.post('/getName',(req,res)=>{   

    //let msg=req.body.message;
    let id=req.body.id;
    if(id==null || id.trim()=='')
    {
        return res.status(404).send("Unable to process your request");
    }
    Messages.findOne({ _id : req.body.id }, function(err,result){
        if(err)
            return res.status(404).send("Unable to process your request");
        return res.status(200).send(result.name);
    })
})

router.post('/sendMessages',(req,res)=>{   


    let msg=req.body.message;
    let id=req.body.id;
    if(msg== null || msg.trim()=='' || id==null || id.trim()=='')
    {
        return res.status(404).send("Unable to process your request");
    }
        
    
    let userData = req.body    
    Messages.findOne({ _id : req.body.id }, function(err,result){
        if(err)
            return res.status(404).send("Unable to process your request");
        result.messages.push(req.body.message);
        result.save(function(err,msg) {
            if(err)
                return res.status(404).send("Unable to process your request");
            io.emit('notification',msg);
            return res.status(200).send({"status":"success"});

        })
    })
})



router.post('/getMessages',(req,res)=>{   

    let token=req.body.id

    console.log(token+"-------------------");

    if(token==null || token=='')
        res.status(401).send("Unauthorised");
    
    let userData = req.body
    //.update(req.body._id).messages.push(req.body.message)  
    

    User.findById({_id:req.body.mytoken})
        .then((doc)=>{
            console.log("doc"+doc)
            if(doc.Vents === req.body.id){

                Messages.findOne({ _id : token }, function(err,result){
                    if(err) console.log(err);
                    return res.status(200).send(result);
                })

            }
            else
                return res.status(401).send("Unauthorised");
            
            console.log("----------------------");
           
        }).catch((err)=>{
            return res.status(401).send("Unauthorised");
        });  


    
})



module.exports=router