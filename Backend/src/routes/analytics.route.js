import express from 'express';
import {
  getUrlClicks,
  getDeviceStats,
  getLocationStats,
  getUserAnalytics,
} from '../controllers/analytics.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.get('/clicks/:id', authMiddleware, getUrlClicks);
router.get('/device/:id', authMiddleware, getDeviceStats);
router.get('/location/:id', authMiddleware, getLocationStats);
router.get('/user', authMiddleware, getUserAnalytics);

export default router;