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

// Create new item with image
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const itemData = {
            title: req.body.title,
            description: req.body.description,
            foundLocation: req.body.foundLocation,
            handoverLocation: req.body.handoverLocation,
            reporterRollNo: req.body.reporterRollNo
        };

        // If image was uploaded, add the Cloudinary data
        if (req.file) {
            itemData.image = {
                url: req.file.path,
                public_id: req.file.filename
            };
        }

        const item = await Item.create(itemData);
        res.status(201).json({ success: true, item });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
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

        await Item.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update status
router.put('/:id/status', async (req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(
            req.params.id,
            { status: 'claimed' },
            { new: true }
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

// Optional: Add route to update item with new image
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        const updateData = {
            title: req.body.title,
            description: req.body.description,
            foundLocation: req.body.foundLocation,
            handoverLocation: req.body.handoverLocation
        };

        // If new image is uploaded
        if (req.file) {
            // Delete old image from Cloudinary if it exists
            if (item.image && item.image.public_id) {
                await cloudinary.uploader.destroy(item.image.public_id);
            }

            // Add new image data
            updateData.image = {
                url: req.file.path,
                public_id: req.file.filename
            };
        }

        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        res.json({ success: true, item: updatedItem });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;