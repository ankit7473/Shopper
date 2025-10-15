// Add these to your existing index.js

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = `product_${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Serve static files
app.use('/images', express.static(path.join(__dirname, 'uploads')));

// Environment configuration
const isProduction = process.env.NODE_ENV === 'production';
const backendUrl = isProduction 
    ? 'https://shopper-backend-delta.vercel.app'
    : `http://localhost:${port}`;

// Upload endpoint
app.post('/upload', upload.single('product'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

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
