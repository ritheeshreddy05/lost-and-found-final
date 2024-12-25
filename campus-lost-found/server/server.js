const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { upload } = require('./config/cloudinary');
const Item = require('./models/Item');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// Create new item - with file upload and default handoverLocation
app.post('/api/items', upload.single('image'), async (req, res) => {
    try {
        console.log('Received request body:', req.body); // Debug log

        const itemData = {
            title: req.body.title,
            description: req.body.description,
            foundLocation: req.body.foundLocation,
            reporterRollNo: req.body.reporterRollNo,
            handoverLocation: 'Security Office', // Set default value
            status: 'pending'
        };

        // Add image if uploaded
        if (req.file) {
            itemData.image = {
                url: req.file.path,
                public_id: req.file.filename
            };
        }

        console.log('Creating item with data:', itemData); // Debug log

        const newItem = new Item(itemData);
        const savedItem = await newItem.save();

        res.status(201).json({
            success: true,
            item: savedItem
        });
    } catch (error) {
        console.error('Error creating item:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Error creating item'
        });
    }
});

// Get all items
app.get('/api/items', async (req, res) => {
    try {
        const items = await Item.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// Search items
app.get('/api/items/search', async (req, res) => {
    const { query } = req.query;
    try {
        const items = await Item.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        }).sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});