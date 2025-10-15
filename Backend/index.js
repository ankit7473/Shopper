const port = process.env.PORT || 4000;
import  express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import multer from "multer";
import path from "path";
import mongoose, { Mongoose } from "mongoose";
import { error } from "console";

const app=express();

app.use(express.json());
app.use(cors());




//  CONNECT TO MONGODB
mongoose.connect("mongodb+srv://ankitkumar62601:kakashi0727@cluster0.fco9cxe.mongodb.net/e-commerce");

//  API CREATION

app.get("/",(req,res)=>{
    res.send("express app is running");
})


// image storage engine through multer
const storage=multer.diskStorage({
    destination:"./upload/images",
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)    }
})

const upload=multer({storage:storage});

app.use('/images',express.static('./upload/images'))

app.post('/upload',upload.single('product'),(req,res)=>{
    res.json({
        success:1,
      image_url:`https://shopper-jiwn.vercel.app/images/${req.file.filename}`

    })
})



// creating a mongoose schema
const Product=mongoose.model("Product",{
    id:{
        type:Number,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    new_price:{
        type:Number,
        required:true
    },
    old_price:{
        type:Number,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    available:{
        type:Boolean,
        default:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})

// adding product to database
app.post('/addproduct',async(req,res)=>{
    let products=await Product.find({});
    let id;
    if (products.length > 0) {
    let last_product = products[products.length - 1];
    id = last_product.id + 1;
}
    else{
        id=1;
    }
    const product=new Product({
        id:id,
        name:req.body.name,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
        image:req.body.image
    })
     await product.save();
     console.log("saved");
     res.json({
        success:true,
        name:req.body.name
     })

})

// remove product from the database
app.post('/removeproduct',async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success:true
    })
})

// API for get all the products from database

app.get('/allproducts',async(req,res)=>{
    const products=await Product.find({});
    // console.log("Fetched all the products successfully");
    res.send(products);
})

// creating user schema

const User=mongoose.model('User',{
    name:{
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
        required:true
    },
    cartData:{
        type:{},
    },
    date:{
        type:Date,
        default:Date.now
    }
})


// API for signing up a user

app.post('/signup',async(req,res)=>{
    const check= await User.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,errors:"Exsiting email address is used before"})
    }
    let cart={};
    for (let i=0;i<300;i++){
        cart[i]=0;
    }
    const user=new User({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })
   await user.save()
   const data={
    user:{
        id:user.id
    }
   }

   const token=jwt.sign(data,'secret_ecom')
   res.json({success:true,token})
})

// API for login a user

app.post('/login',async(req,res)=>{
    let user=await User.findOne({email:req.body.email});
    if(user){
        let passwordCheck=req.body.password===user.password;
        if(passwordCheck){
            const data={
                user:{
                    id:user.id
                }
            }
            const token =jwt.sign(data,'secret_ecom');
            res.json({
                success:true,
                token
            })
        }
        else{
            res.json({success:false,errors:'Wrong Password'})
        }
    }
    else{
        res.json({success:false,error:"Wrong Email Id"})
    }
})

// API for newcollection

app.get('/newcollections',async(req,res)=>{
    let product= await Product.find({});
    let newcollections=product.slice(1).slice(-8);
    // console.log("newcollection fetched");
    res.send(newcollections);
})

// API for popular collection in women
app.get('/popularinwomen',async (req,res)=>{
    let product=await Product.find({category:'women'});
    let popularInwomen=product.slice(0,4);
    // console.log("fetched popular in women successfully");
    res.send(popularInwomen);
})

// middleware for finding the user
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
         res.status(401).send({ errors: "Please authenticate with a valid token" });
    }
        else{
    try {
        const data = jwt.verify(token, 'secret_ecom');
        req.user = data.user;
        next();
    } catch (error) {
        return res.status(401).send({ error: "Unauthorized user" });
    }
}
}

 // API for adding items in cart
app.post('/addtocart',fetchUser, async (req,res)=>{
        const userData= await User.findOne({_id:req.user.id});
        userData.cartData[req.body.id]+=1;
        await User.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
        res.send("Added");
})

// API for removing items from the cart
app.post('/removefromcart',fetchUser,async (req,res)=>{
     const userData= await User.findOne({_id:req.user.id});
     if(userData.cartData[req.body.id]>0)
        userData.cartData[req.body.id] -=1;
        await User.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
        res.send("Removed");
})

// API for get all cart
app.post('/getallcart',fetchUser,async(req,res)=>{
    let userData=await User.findOne({_id:req.user.id});
    res.send(userData.cartData);
})
app.listen(port,(error)=>{
    if(!error){
        console.log("Server is running on Port :" +port);
    }
    else{
        console.log("Error: "+error);
    }
})
