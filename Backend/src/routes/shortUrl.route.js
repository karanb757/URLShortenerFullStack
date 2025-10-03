import express from 'express';
import {
  createShortUrl,
  getUserUrls,
  getUrlById,
  deleteUrl,
} from '../controllers/short_url.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.post('/', authMiddleware, createShortUrl);
router.get('/', authMiddleware, getUserUrls);
router.get('/:id', authMiddleware, getUrlById);
router.delete('/:id', authMiddleware, deleteUrl);

export default router;