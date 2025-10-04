import ShortUrl from '../models/shortUrlSchema.model.js';
import Click from '../models/click.model.js';
import QRCode from 'qrcode';
import { nanoid } from 'nanoid';

const MAX_RETRIES = 5;
const APP_URL = process.env.APP_URL || 'http://localhost:3000';

// Helper: Validate URL format
function isValidUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch (err) {
    return false;
  }
}

// Helper: Sanitize custom URL
function sanitizeCustomUrl(customUrl) {
  return customUrl.replace(/[^a-zA-Z0-9_-]/g, "");
}

// Helper: Check if short code exists
async function isShortCodeTaken(shortCode) {
  const existing = await ShortUrl.findOne({ 
    $or: [{ short_url: shortCode }, { custom_url: shortCode }] 
  });
  return !!existing;
}

// Create Short URL
export const createShortUrl = async (req, res) => {
  try {
    const { title, longUrl, customUrl } = req.body;
    const userId = req.user._id;

    console.log('=== CREATE SHORT URL ===');
    console.log('Request body:', req.body);
    console.log('User ID:', userId);

    // Validation
    if (!longUrl) {
      return res.status(400).json({ error: 'Long URL is required' });
    }

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Validate URL format
    if (!isValidUrl(longUrl)) {
      return res.status(400).json({ 
        error: 'Invalid URL format. Must be a valid HTTP/HTTPS URL' 
      });
    }

    // Validate title length
    if (title.length > 200) {
      return res.status(400).json({ 
        error: 'Title must be 200 characters or less' 
      });
    }

    let shortCode;

    // Handle custom URL
    if (customUrl) {
      const sanitized = sanitizeCustomUrl(customUrl);
      
      // Validate custom URL
      if (sanitized.length < 3 || sanitized.length > 50) {
        return res.status(400).json({ 
          error: 'Custom URL must be between 3 and 50 characters' 
        });
      }

      // Reserved words check
      const reserved = ["api", "admin", "shorten", "stats", "dashboard", "auth", "urls", "analytics"];
      if (reserved.includes(sanitized.toLowerCase())) {
        return res.status(400).json({ 
          error: 'This custom URL is reserved' 
        });
      }

      // Check uniqueness
      if (await isShortCodeTaken(sanitized)) {
        return res.status(409).json({ 
          error: 'Custom URL already exists. Please choose another.' 
        });
      }

      shortCode = sanitized;
    } else {
      // Generate unique random short code
      let attempts = 0;
      let isUnique = false;

      while (!isUnique && attempts < MAX_RETRIES) {
        shortCode = nanoid(8);
        isUnique = !(await isShortCodeTaken(shortCode));
        attempts++;
      }

      if (!isUnique) {
        return res.status(500).json({ 
          error: 'Unable to generate unique short URL. Please try again.' 
        });
      }
    }

    console.log('Generated short code:', shortCode);

    // Generate QR code as base64
    const shortUrlFull = `${APP_URL}/${shortCode}`;
    console.log('Full short URL:', shortUrlFull);
    
    const qrDataUrl = await QRCode.toDataURL(shortUrlFull);

    // Create short URL document
    const newUrl = new ShortUrl({
      title: title.trim(),
      full_url: longUrl,
      original_url: longUrl,
      short_url: shortCode,
      custom_url: customUrl ? shortCode : null,
      qr: qrDataUrl,
      clicks: 0,
      user_id: userId,
      created_at: new Date(),
    });

    await newUrl.save();
    console.log('URL saved to database:', newUrl._id);

    const responseData = {
      id: newUrl._id,
      title: newUrl.title,
      original_url: newUrl.original_url,
      short_url: newUrl.short_url,
      custom_url: newUrl.custom_url,
      qr: newUrl.qr,
      clicks: newUrl.clicks,
      created_at: newUrl.created_at,
    };

    console.log('Sending response:', responseData);
    res.status(201).json(responseData);
  } catch (error) {
    console.error('Create short URL error:', error);
    
    // Handle duplicate key errors (race condition)
    if (error.code === 11000) {
      return res.status(409).json({ 
        error: 'URL code already exists. Please try again.' 
      });
    }
    
    res.status(500).json({ error: error.message });
  }
};

// Get all URLs for a user
export const getUserUrls = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 50 } = req.query;

    const urls = await ShortUrl.find({ user_id: userId })
      .sort({ created_at: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await ShortUrl.countDocuments({ user_id: userId });

    const urlsWithFullPath = urls.map(url => ({
      id: url._id,
      title: url.title,
      original_url: url.original_url,
      short_url: url.short_url,
      custom_url: url.custom_url,
      qr: url.qr,
      clicks: url.clicks,
      created_at: url.created_at,
    }));

    res.json({
      urls: urlsWithFullPath,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / parseInt(limit)),
        total_urls: total,
      },
    });
  } catch (error) {
    console.error('Get user URLs error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get single URL by ID
export const getUrlById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const url = await ShortUrl.findOne({ _id: id, user_id: userId });

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    res.json({
      id: url._id,
      title: url.title,
      original_url: url.original_url,
      short_url: url.short_url,
      custom_url: url.custom_url,
      qr: url.qr,
      clicks: url.clicks,
      created_at: url.created_at,
    });
  } catch (error) {
    console.error('Get URL by ID error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update URL (NEW)
export const updateUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { title } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    if (title.length > 200) {
      return res.status(400).json({ 
        error: 'Title must be 200 characters or less' 
      });
    }

    const url = await ShortUrl.findOneAndUpdate(
      { _id: id, user_id: userId },
      { title: title.trim() },
      { new: true }
    );

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    res.json({
      id: url._id,
      title: url.title,
      original_url: url.original_url,
      short_url: url.short_url,
      custom_url: url.custom_url,
      qr: url.qr,
      clicks: url.clicks,
      created_at: url.created_at,
    });
  } catch (error) {
    console.error('Update URL error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete URL
export const deleteUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const url = await ShortUrl.findOneAndDelete({ _id: id, user_id: userId });

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // Also delete associated clicks
    await Click.deleteMany({ url_id: id });

    res.json({ message: 'URL deleted successfully' });
  } catch (error) {
    console.error('Delete URL error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Redirect short URL to original URL (Public route)
export const redirectUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await ShortUrl.findOne({
      $or: [{ short_url: shortCode }, { custom_url: shortCode }]
    });

    if (!url) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>404 - Link Not Found</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
              h1 { color: #7f57f1; }
            </style>
          </head>
          <body>
            <h1>404 - Link Not Found</h1>
            <p>The short link you're looking for doesn't exist.</p>
          </body>
        </html>
      `);
    }

    // Increment click count
    url.clicks += 1;
    url.last_accessed = new Date();
    await url.save();

    // Track click with device info
    const userAgent = req.headers['user-agent'] || '';
    let device = 'desktop';
    
    if (/mobile/i.test(userAgent)) {
      device = 'mobile';
    } else if (/tablet/i.test(userAgent)) {
      device = 'tablet';
    }

    // Get IP-based location (optional - you can integrate ipapi.co or similar)
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || 
                req.connection.remoteAddress || 
                'Unknown';

    // Create click record
    const click = new Click({
      url_id: url._id,
      device: device,
      city: 'Unknown', // Integrate IP geolocation API here if needed
      country: 'Unknown',
      created_at: new Date(),
    });

    await click.save();

    // Redirect to original URL
    res.redirect(url.original_url);
  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).send('Internal Server Error');
  }
};