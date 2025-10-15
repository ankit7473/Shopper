console.log("🚀 Server starting initialization...");

const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

// With this specific CORS configuration:
app.use(cors({
    origin: [
        'https://shopper-gamma-fawn.vercel.app',
        'http://localhost:3000',
        'http://localhost:3001'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'auth-token', 'Accept']
}));

// Handle preflight requests
app.options('*', cors());
// CONNECT TO MONGODB with error handling
console.log("🔌 Connecting to MongoDB...");
mongoose.connect("mongodb+srv://ankitkumar62601:kakashi0727@cluster0.fco9cxe.mongodb.net/e-commerce")
.then(() => console.log("✅ MongoDB connected successfully"))
.catch(err => console.log("❌ MongoDB connection error:", err));

// Environment configuration
const isProduction = process.env.NODE_ENV === 'production';
const backendUrl = isProduction 
    ? 'https://shopper-backend-delta.vercel.app'
    : `http://localhost:${port}`;

console.log(`🌍 Environment: ${isProduction ? 'Production' : 'Development'}`);
console.log(`🔗 Backend URL: ${backendUrl}`);

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/';
        // Create uploads directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Create unique filename with timestamp
        const uniqueName = `product_${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Check file type
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Serve static files from uploads directory
app.use('/images', express.static(path.join(__dirname, 'uploads')));

// API CREATION
app.get("/", (req, res) => {
    res.send("Express app is running");
});

// creating a mongoose schema
const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    new_price: {
        type: Number,
        required: true
    },
    old_price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        default: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// UPLOAD ENDPOINT - for image uploads
app.post('/upload', upload.single('product'), async (req, res) => {
    try {
        console.log("📤 Upload request received");
        
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        // Generate the correct URL based on environment
        const imageUrl = `${backendUrl}/images/${req.file.filename}`;
        
        console.log("📁 File uploaded:", req.file.filename);
        console.log("🔗 Image URL:", imageUrl);

        res.json({
            success: true,
            image_url: imageUrl,
            filename: req.file.filename
        });
    } catch (error) {
        console.error("❌ Upload error:", error);
        res.status(500).json({
            success: false,
            message: "Upload failed",
            error: error.message
        });
    }
});

// adding product to database
app.post('/addproduct', async (req, res) => {
    try {
        console.log("📦 Adding product request:", req.body);
        
        let products = await Product.find({});
        let id;
        if (products.length > 0) {
            let last_product = products[products.length - 1];
            id = last_product.id + 1;
        } else {
            id = 1;
        }

        const product = new Product({
            id: id,
            name: req.body.name,
            category: req.body.category,
            new_price: req.body.new_price,
            old_price: req.body.old_price,
            image: req.body.image
        });
        
        await product.save();
        console.log("✅ Product saved:", product.name);
        
        res.json({
            success: true,
            name: req.body.name,
            productId: id
        });
    } catch (error) {
        console.error("❌ Error adding product:", error);
        res.status(500).json({
            success: false,
            message: "Error adding product",
            error: error.message
        });
    }
});

// remove product from the database
app.post('/removeproduct', async (req, res) => {
    try {
        await Product.findOneAndDelete({ id: req.body.id });
        console.log("✅ Product removed, ID:", req.body.id);
        
        res.json({
            success: true,
            message: "Product removed successfully"
        });
    } catch (error) {
        console.error("❌ Error removing product:", error);
        res.status(500).json({
            success: false,
            message: "Error removing product",
            error: error.message
        });
    }
});

// API for get all the products from database
app.get('/allproducts', async (req, res) => {
    try {
        const products = await Product.find({});
        console.log(`📋 Sent ${products.length} products`);
        res.send(products);
    } catch (error) {
        console.error("❌ Error fetching products:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching products",
            error: error.message
        });
    }
});

// creating user schema
const User = mongoose.model('User', {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    cartData: {
        type: Object,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// API for signing up a user
app.post('/signup', async (req, res) => {
    try {
        const check = await User.findOne({ email: req.body.email });
        if (check) {
            return res.status(400).json({ success: false, errors: "Existing email address is used before" });
        }
        
        let cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }
        
        const user = new User({
            name: req.body.username,
            email: req.body.email,
            password: req.body.password,
            cartData: cart,
        });
        
        await user.save();
        const data = {
            user: {
                id: user.id
            }
        };
        
        const token = jwt.sign(data, 'secret_ecom');
        console.log("✅ New user signed up:", user.email);
        
        res.json({ success: true, token });
    } catch (error) {
        console.error("❌ Signup error:", error);
        res.status(500).json({
            success: false,
            message: "Signup failed",
            error: error.message
        });
    }
});

// API for login a user
app.post('/login', async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            let passwordCheck = req.body.password === user.password;
            if (passwordCheck) {
                const data = {
                    user: {
                        id: user.id
                    }
                };
                const token = jwt.sign(data, 'secret_ecom');
                console.log("✅ User logged in:", user.email);
                
                res.json({
                    success: true,
                    token
                });
            } else {
                res.json({ success: false, errors: 'Wrong Password' });
            }
        } else {
            res.json({ success: false, error: "Wrong Email Id" });
        }
    } catch (error) {
        console.error("❌ Login error:", error);
        res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message
        });
    }
});

// API for newcollection
app.get('/newcollections', async (req, res) => {
    try {
        let product = await Product.find({});
        let newcollections = product.slice(1).slice(-8);
        console.log("🎯 Sent new collections");
        res.send(newcollections);
    } catch (error) {
        console.error("❌ Error fetching new collections:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching new collections",
            error: error.message
        });
    }
});

// API for popular collection in women
app.get('/popularinwomen', async (req, res) => {
    try {
        let product = await Product.find({ category: 'women' });
        let popularInwomen = product.slice(0, 4);
        console.log("👩 Sent popular in women");
        res.send(popularInwomen);
    } catch (error) {
        console.error("❌ Error fetching popular in women:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching popular in women",
            error: error.message
        });
    }
});

// middleware for finding the user
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ errors: "Please authenticate with a valid token" });
    } else {
        try {
            const data = jwt.verify(token, 'secret_ecom');
            req.user = data.user;
            next();
        } catch (error) {
            return res.status(401).send({ error: "Unauthorized user" });
        }
    }
};

// API for adding items in cart
app.post('/addtocart', fetchUser, async (req, res) => {
    try {
        const userData = await User.findOne({ _id: req.user.id });
        userData.cartData[req.body.id] += 1;
        await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
        console.log("🛒 Item added to cart for user:", req.user.id);
        res.send("Added");
    } catch (error) {
        console.error("❌ Error adding to cart:", error);
        res.status(500).json({
            success: false,
            message: "Error adding to cart",
            error: error.message
        });
    }
});

// API for removing items from the cart
app.post('/removefromcart', fetchUser, async (req, res) => {
    try {
        const userData = await User.findOne({ _id: req.user.id });
        if (userData.cartData[req.body.id] > 0)
            userData.cartData[req.body.id] -= 1;
        await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
        console.log("🛒 Item removed from cart for user:", req.user.id);
        res.send("Removed");
    } catch (error) {
        console.error("❌ Error removing from cart:", error);
        res.status(500).json({
            success: false,
            message: "Error removing from cart",
            error: error.message
        });
    }
});

// API for get all cart
app.post('/getallcart', fetchUser, async (req, res) => {
    try {
        let userData = await User.findOne({ _id: req.user.id });
        console.log("🛒 Sent cart data for user:", req.user.id);
        res.send(userData.cartData);
    } catch (error) {
        console.error("❌ Error fetching cart:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching cart",
            error: error.message
        });
    }
});

// Fix existing image URLs in database
app.get('/fix-image-urls', async (req, res) => {
    try {
        const products = await Product.find({});
        let updatedCount = 0;

        for (let product of products) {
            if (product.image && product.image.includes('localhost:4000')) {
                // Replace localhost with production URL
                product.image = product.image.replace(
                    'http://localhost:4000',
                    'https://shopper-backend-delta.vercel.app'
                );
                await product.save();
                updatedCount++;
                console.log(`✅ Updated: ${product.image}`);
            }
        }

        res.json({
            success: true,
            message: `Updated ${updatedCount} product image URLs`
        });
    } catch (error) {
        console.error('Error fixing image URLs:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: isProduction ? 'production' : 'development',
        backendUrl: backendUrl
    });
});

app.listen(port, (error) => {
    if (!error) {
        console.log("🎉 Server is running on Port: " + port);
        console.log("🔗 Backend URL: " + backendUrl);
        console.log("📁 Uploads served from: /images");
    } else {
        console.log("❌ Error: " + error);
    }
});
