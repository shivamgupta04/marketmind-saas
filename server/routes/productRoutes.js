import express from 'express';
import multer from 'multer';
import { generateListing, getMyListings } from '../controllers/productController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

router.post('/generate', protect, upload.single('productImage'), generateListing);
router.get('/my-listings', protect, getMyListings);

export default router;