// import express from 'express';
// import {
//   createShortUrl,
//   getUserUrls,
//   getUrlById,
//   deleteUrl,
// } from '../controllers/short_url.controller.js';
// import { authMiddleware } from '../middleware/auth.middleware.js';

// const router = express.Router();

// // All routes require authentication
// router.post('/', authMiddleware, createShortUrl);
// router.get('/', authMiddleware, getUserUrls);
// router.get('/:id', authMiddleware, getUrlById);
// router.delete('/:id', authMiddleware, deleteUrl);

// export default router;

import express from 'express';
import {
  createShortUrl,
  getUserUrls,
  getUrlById,
  updateUrl,
  deleteUrl,
} from '../controllers/short_url.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { rateLimiter } from '../middleware/rateLimiter.middleware.js';

const router = express.Router();

// Rate limit: 10 URLs per 15 minutes per user
const createLimiter = rateLimiter({ 
  windowMs: 15 * 60 * 1000, 
  max: 10,
  message: 'Too many URLs created. Please try again in 15 minutes.' 
});

router.post('/', authMiddleware, createLimiter, createShortUrl);
router.get('/', authMiddleware, getUserUrls);
router.get('/:id', authMiddleware, getUrlById);
router.put('/:id', authMiddleware, updateUrl);
router.delete('/:id', authMiddleware, deleteUrl);

export default router;