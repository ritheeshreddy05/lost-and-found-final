const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const { upload, cloudinary } = require('../config/cloudinary');

// Get all items
router.get('/', async (req, res) => {
    try {
        const items = await Item.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Create new item
router.post('/', upload.single('image'), async (req, res) => {
    try {
        // Create item data with default handoverLocation
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

// Delete item (with image cleanup)
router.delete('/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        // Delete image from Cloudinary if it exists
        if (item.image && item.image.public_id) {
            await cloudinary.uploader.destroy(item.image.public_id);
        }

        await item.deleteOne(); // Using deleteOne() instead of findByIdAndDelete for better performance
        res.json({ success: true, message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update item status
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!status || !['pending', 'claimed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value. Must be either "pending" or "claimed"'
            });
        }

        const item = await Item.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );
        
        if (!item) {
            return res.status(404).json({ 
                success: false, 
                message: 'Item not found' 
            });
        }
        
        res.json({ 
            success: true, 
            item 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// Update item with new image
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        const updateData = {};
        const allowedFields = ['title', 'description', 'foundLocation', 'handoverLocation'];
        
        // Only update fields that are provided
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        if (req.file) {
            // Delete old image from Cloudinary if it exists
            if (item.image && item.image.public_id) {
                await cloudinary.uploader.destroy(item.image.public_id);
            }

            updateData.image = {
                url: req.file.path,
                public_id: req.file.filename
            };
        }

        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({ success: true, item: updatedItem });
    } catch (error) {
        // Cleanup uploaded image if update fails
        if (req.file && req.file.filename) {
            await cloudinary.uploader.destroy(req.file.filename);
        }
        res.status(500).json({ success: false, message: error.message });
    }
});

// Add this new route
router.get('/new', async (req, res) => {
    try {
        const { since } = req.query;
        const newItems = await Item.find({
            createdAt: { $gt: new Date(parseInt(since)) }
        }).sort({ createdAt: -1 });
        
        res.json(newItems);
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching new items' 
        });
    }
});

module.exports = router;