import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/mongo.config.js';

// Import routes
import authRoutes from './src/routes/auth.route.js';
import shortUrlRoutes from './src/routes/shortUrl.route.js';
import analyticsRoutes from './src/routes/analytics.route.js';
import redirectRoutes from './src/routes/redirect.route.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// CORS Configuration - Allow all Vercel deployments
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://url-shortener-full-stack-9epxhgoks.vercel.app',
  'https://url-shortener-full-stack-lspr.vercel.app',
  'https://url-shortener-full-stack-main.vercel.app',
  'https://url-shortener-full-stack-vert.vercel.app',
   process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    // Allow all Vercel preview deployments (any URL with your project name)
    if (origin && origin.includes('url-shortener-full-stack') && origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    // Allow localhost and explicitly listed origins
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    console.log('Blocked by CORS:', origin);
    console.log('Allowed origins:', allowedOrigins);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Trust proxy - Important for production
app.set('trust proxy', 1);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check - Add this BEFORE other routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/urls', shortUrlRoutes);
app.use('/api/analytics', analyticsRoutes);

// Public redirect route - MUST BE LAST
// This catches all remaining routes like /:shortCode
app.use('/', redirectRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler - This should rarely be hit now
app.use((req, res) => {
  console.log('404 - Route not found:', req.method, req.url);
  res.status(404).json({ 
    error: 'Route not found',
    path: req.url,
    method: req.method
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`App URL: ${process.env.APP_URL}`);
  console.log('Allowed CORS origins:', allowedOrigins);
});

export default app;
