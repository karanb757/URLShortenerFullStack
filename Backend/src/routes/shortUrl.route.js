import express from 'express'
import { createShortUrl } from '../controllers/short_url.controller.js';
const router = express.Router();

// '/api/create' pe aayega voh ab home page hogya -> '/'
router.post('/',createShortUrl)

export default router;