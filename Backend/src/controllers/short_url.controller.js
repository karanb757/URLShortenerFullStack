import ShortUrl from '../models/shortUrlSchema.model.js';
import Click from '../models/click.model.js';
import QRCode from 'qrcode';
import { nanoid } from 'nanoid';

// Create Short URL
export const createShortUrl = async (req, res) => {
  try {
    const { title, longUrl, customUrl } = req.body;
    const userId = req.user._id;

    console.log('=== CREATE SHORT URL ===');
    console.log('Request body:', req.body);
    console.log('User ID:', userId);

    // Validate longUrl
    if (!longUrl) {
      return res.status(400).json({ error: 'Long URL is required' });
    }

    // Generate short code
    const shortCode = customUrl || nanoid(8);
    console.log('Generated short code:', shortCode);

    // Check if custom URL already exists
    if (customUrl) {
      const existing = await ShortUrl.findOne({ 
        $or: [{ short_url: shortCode }, { custom_url: customUrl }] 
      });
      if (existing) {
        return res.status(400).json({ error: 'Custom URL already taken' });
      }
    }

    // Generate QR code as base64
    const shortUrlFull = `${process.env.APP_URL || 'http://localhost:3000'}/${shortCode}`;
    console.log('Full short URL:', shortUrlFull);
    
    const qrDataUrl = await QRCode.toDataURL(shortUrlFull);

    // Create short URL document
    const newUrl = new ShortUrl({
      title: title || 'Untitled',
      full_url: longUrl,
      original_url: longUrl,
      short_url: shortCode,
      custom_url: customUrl || null,
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
    res.status(500).json({ error: error.message });
  }
};

// Get all URLs for a user
export const getUserUrls = async (req, res) => {
  try {
    const userId = req.user._id;

    const urls = await ShortUrl.find({ user_id: userId })
      .sort({ created_at: -1 });

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

    res.json(urlsWithFullPath);
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
      return res.status(404).json({ error: 'URL not found' });
    }

    // Increment click count
    url.clicks += 1;
    await url.save();

    // Track click with device info
    const userAgent = req.headers['user-agent'] || '';
    let device = 'desktop';
    
    if (/mobile/i.test(userAgent)) {
      device = 'mobile';
    } else if (/tablet/i.test(userAgent)) {
      device = 'tablet';
    }

    // Create click record
    const click = new Click({
      url_id: url._id,
      device: device,
      city: 'Unknown', // You can integrate IP geolocation API here
      country: 'Unknown',
      created_at: new Date(),
    });

    await click.save();

    // Redirect to original URL
    res.redirect(url.original_url);
  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).json({ error: error.message });
  }
};