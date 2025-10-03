import Click from '../models/click.model.js';
import ShortUrl from '../models/shortUrlSchema.model.js';

// Get clicks for a specific URL
export const getUrlClicks = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Verify URL belongs to user
    const url = await ShortUrl.findOne({ _id: id, user_id: userId });
    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // Get all clicks for this URL
    const clicks = await Click.find({ url_id: id })
      .sort({ created_at: -1 });

    res.json(clicks.map(click => ({
      id: click._id,
      url_id: click.url_id,
      city: click.city,
      country: click.country,
      device: click.device,
      created_at: click.created_at,
    })));
  } catch (error) {
    console.error('Get URL clicks error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get device stats for a URL
export const getDeviceStats = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Verify URL belongs to user
    const url = await ShortUrl.findOne({ _id: id, user_id: userId });
    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // Aggregate device stats
    const deviceStats = await Click.aggregate([
      { $match: { url_id: url._id } },
      { $group: { _id: '$device', count: { $sum: 1 } } },
      { $project: { device: '$_id', count: 1, _id: 0 } }
    ]);

    res.json(deviceStats);
  } catch (error) {
    console.error('Get device stats error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get location stats for a URL
export const getLocationStats = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Verify URL belongs to user
    const url = await ShortUrl.findOne({ _id: id, user_id: userId });
    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // Aggregate location stats by city
    const locationStats = await Click.aggregate([
      { $match: { url_id: url._id } },
      { 
        $group: { 
          _id: { city: '$city', country: '$country' }, 
          count: { $sum: 1 } 
        } 
      },
      { 
        $project: { 
          city: '$_id.city', 
          country: '$_id.country', 
          count: 1, 
          _id: 0 
        } 
      },
      { $sort: { count: -1 } }
    ]);

    res.json(locationStats);
  } catch (error) {
    console.error('Get location stats error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get overall analytics for a user (optional - for dashboard)
export const getUserAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all user's URLs
    const urls = await ShortUrl.find({ user_id: userId });
    const urlIds = urls.map(url => url._id);

    // Get total clicks
    const totalClicks = await Click.countDocuments({ 
      url_id: { $in: urlIds } 
    });

    // Get clicks by device
    const deviceStats = await Click.aggregate([
      { $match: { url_id: { $in: urlIds } } },
      { $group: { _id: '$device', count: { $sum: 1 } } },
      { $project: { device: '$_id', count: 1, _id: 0 } }
    ]);

    // Get top URLs by clicks
    const topUrls = await ShortUrl.find({ user_id: userId })
      .sort({ clicks: -1 })
      .limit(5)
      .select('title short_url clicks');

    res.json({
      totalUrls: urls.length,
      totalClicks,
      deviceStats,
      topUrls,
    });
  } catch (error) {
    console.error('Get user analytics error:', error);
    res.status(500).json({ error: error.message });
  }
};