const rateLimitStore = new Map();

export const rateLimiter = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 10, // 10 requests per window
    message = 'Too many requests, please try again later'
  } = options;

  return (req, res, next) => {
    const identifier = req.user?._id || req.ip;
    const now = Date.now();
    
    if (!rateLimitStore.has(identifier)) {
      rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
      return next();
    }

    const record = rateLimitStore.get(identifier);
    
    if (now > record.resetTime) {
      rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (record.count >= max) {
      return res.status(429).json({ error: message });
    }

    record.count++;
    rateLimitStore.set(identifier, record);
    next();
  };
};

// Clean up expired entries every hour
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 60 * 1000);