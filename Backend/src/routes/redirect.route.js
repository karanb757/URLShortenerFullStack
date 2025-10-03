import express from 'express';
import { redirectUrl } from '../controllers/short_url.controller.js';

const router = express.Router();

// Public route - no authentication needed
router.get('/:shortCode', redirectUrl);

export default router;