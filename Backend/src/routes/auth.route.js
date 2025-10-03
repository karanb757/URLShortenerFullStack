// import express from 'express';
// import { signup, login, getCurrentUser, logout } from '../controllers/auth.controller.js';
// import { authMiddleware } from '../middleware/auth.middleware.js';

// const router = express.Router();

// // Public routes
// router.post('/signup', signup);
// router.post('/login', login);

// // Protected routes
// router.get('/me', authMiddleware, getCurrentUser);
// router.post('/logout', authMiddleware, logout);

// export default router;


import express from 'express';
import {
  createShortUrl,
  getUserUrls,
  getUrlById,
  updateUrl,  // ADD THIS
  deleteUrl,
} from '../controllers/short_url.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.post('/', authMiddleware, createShortUrl);
router.get('/', authMiddleware, getUserUrls);
router.get('/:id', authMiddleware, getUrlById);
router.put('/:id', authMiddleware, updateUrl);  // ADD THIS LINE
router.delete('/:id', authMiddleware, deleteUrl);

export default router;