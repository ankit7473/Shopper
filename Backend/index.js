import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import multer from "multer";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

// ✅ FIXED CORS CONFIGURATION
app.use(cors({
    origin: [
        'https://shopper-gamma-fawn.vercel.app',
        'http://localhost:3000',
        'http://localhost:3001'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'auth-token']
}));

// Handle preflight requests
app.options('*', cors());

console.log("🚀 Server starting initialization...");

// ✅ FIXED MONGODB CONNECTION
console.log("🔌 Connecting to MongoDB...");
mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://ankitkumar62601:kakashi0727@cluster0.fco9cxe.mongodb.net/e-commerce?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch(err => {
    console.log("❌ MongoDB connection error:", err.message);
    console.log("💡 Please whitelist your IP in MongoDB Atlas");
});

// Environment configuration
const isProduction = process.env.NODE_ENV === 'production';
const backendUrl = isProduction 
    ? 'https://shopper-backend-delta.vercel.app'
    : `http://localhost:${port}`;

console.log(`🌍 Environment: ${isProduction ? 'Production' : 'Development'}`);
console.log(`🔗 Backend URL: ${backendUrl}`);

// ✅ CREATE UPLOAD DIRECTORY IF IT DOESN'T EXIST
const uploadDir = path.join(__dirname, 'upload', 'images');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('📁 Created upload directory:', uploadDir);
}

// ✅ FIXED IMAGE STORAGE ENGINE
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        return cb(null, `product_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

// ✅ FIXED STATIC FILE SERVING
app.use('/images', express.static(uploadDir));

// ✅ HEALTH CHECK ENDPOINT
app.get("/", (req, res) => {
    res.json({
        message: "Express app is running",
        backend: "shopper-backend-delta.vercel.app",
        timestamp: new Date().toISOString(),
        environment: isProduction ? 'production' : 'development'
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        backend: 'shopper-backend-delta.vercel.app',
        timestamp: new Date().toISOString(),
        environment: isProduction ? 'production' : 'development',
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// ✅ FIXED UPLOAD ENDPOINT
app.post('/upload', upload.single('product'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        // Generate correct URL based on environment
        const imageUrl = `${backendUrl}/images/${req.file.filename}`;
        
        console.log("📁 File uploaded:", req.file.filename);
        console.log("🔗 Image URL:", imageUrl);

        res.json({
            success: 1,
            image_url: imageUrl,
            filename: req.file.filename
        });
    } catch (error) {
        console.error("❌ Upload error:", error);
        res.status(500).json({
            success: false,
            message: "Upload failed"
        });
    }
});

// ✅ CREATING MONGOOSE SCHEMAS
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

// ✅ FIX IMAGE URLs ENDPOINT
app.get('/fix-image-urls', async (req, res) => {
    try {
        const products = await Product.find({});
        let updatedCount = 0;

        for (let product of products) {
            if (product.image && product.image.includes('localhost:4000')) {
                product.image = product.image.replace(
                    'http://localhost:4000',
                    'https://shopper-backend-delta.vercel.app'
                );
                await product.save();
                updatedCount++;
                console.log(`✅ Updated: ${product.name}`);
            } else if (product.image && !product.image.startsWith('http')) {
                product.image = `${backendUrl}/images/${product.image}`;
                await product.save();
                updatedCount++;
                console.log(`✅ Fixed: ${product.name}`);
            }
        }

        res.json({
            success: true,
            message: `Updated ${updatedCount} product image URLs`,
            updated: updatedCount
        });
    } catch (error) {
        console.error('Error fixing image URLs:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ✅ ADD PRODUCT ENDPOINT
app.post('/addproduct', async (req, res) => {
    try {
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
            message: "Error adding product"
        });
    }
});

// ✅ ALL PRODUCTS ENDPOINT
app.get('/allproducts', async (req, res) => {
    try {
        const products = await Product.find({});
        console.log(`📋 Sent ${products.length} products`);
        res.send(products);
    } catch (error) {
        console.error("❌ Error fetching products:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching products"
        });
    }
});

// ✅ REMOVE PRODUCT ENDPOINT
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
            message: "Error removing product"
        });
    }
});

// ✅ USER AUTH ENDPOINTS (keep your existing ones)
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
        
        const token = jwt.sign(data, process.env.JWT_SECRET || 'secret_ecom');
        console.log("✅ New user signed up:", user.email);
        
        res.json({ success: true, token });
    } catch (error) {
        console.error("❌ Signup error:", error);
        res.status(500).json({
            success: false,
            message: "Signup failed"
        });
    }
});

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
                const token = jwt.sign(data, process.env.JWT_SECRET || 'secret_ecom');
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
            message: "Login failed"
        });
    }
});

// ✅ OTHER ENDPOINTS (keep your existing ones)
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
            message: "Error fetching new collections"
        });
    }
});

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
            message: "Error fetching popular in women"
        });
    }
});

const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ errors: "Please authenticate with a valid token" });
    } else {
        try {
            const data = jwt.verify(token, process.env.JWT_SECRET || 'secret_ecom');
            req.user = data.user;
            next();
        } catch (error) {
            return res.status(401).send({ error: "Unauthorized user" });
        }
    }
};

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
            message: "Error adding to cart"
        });
    }
});

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
            message: "Error removing from cart"
        });
    }
});

app.post('/getallcart', fetchUser, async (req, res) => {
    try {
        let userData = await User.findOne({ _id: req.user.id });
        console.log("🛒 Sent cart data for user:", req.user.id);
        res.send(userData.cartData);
    } catch (error) {
        console.error("❌ Error fetching cart:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching cart"
        });
    }
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
