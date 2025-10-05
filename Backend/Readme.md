# URL Shortener - Full Stack Setup Guide

## Project Structure
```
project-root/
├── backend/              # Node.js + Express + MongoDB
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── app.js
│   ├── .env
│   └── package.json
│
└── frontend/             # React + Vite
    ├── src/
    │   ├── components/
    │   ├── db/
    │   ├── pages/
    │   └── ...
    ├── .env
    └── package.json
```

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create `.env` file in backend root:
```env
APP_URL=http://localhost:3000/
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_super_secret_jwt_key_change_in_production


### 3. Create Required Directories
```bash
mkdir -p src/config src/controllers src/middleware src/models src/routes src/utils
```

### 4. File Structure
Place the following files in their respective directories:

**Models** (`src/models/`):
- `user.model.js` - User schema
- `shortUrl.model.js` - URL schema
- `click.model.js` - Click tracking schema

**Controllers** (`src/controllers/`):
- `auth.controller.js` - Authentication logic
- `short_url.controller.js` - URL shortening logic
- `analytics.controller.js` - Analytics logic

**Routes** (`src/routes/`):
- `auth.route.js` - Auth endpoints
- `shortUrl.route.js` - URL endpoints
- `analytics.route.js` - Analytics endpoints

**Middleware** (`src/middleware/`):
- `auth.middleware.js` - JWT authentication

**Config** (`src/config/`):
- `mongo.config.js` - MongoDB connection

**Utils** (`src/utils/`):
- `helper.js` - Helper functions

### 5. Start MongoDB
Make sure MongoDB is running:
```bash
# On macOS
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# On Windows
net start MongoDB
```

### 6. Run Backend Server
```bash
npm run dev
```
Server will run on `http://localhost:3000`

---

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables
Create `.env` file in frontend root:
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_URL=http://localhost:3000
```

### 3. Update API Files
Replace the following files with the new versions:

**API Client Files** (`src/db/`):
- `apiClient.js` - Base API client with auth
- `apiAuth.js` - Authentication API calls
- `apiUrls.js` - URL management API calls
- `apiClicks.js` - Analytics API calls

**Remove Supabase**:
Delete or comment out:
- `src/db/supabase.js` - No longer needed
- Any Supabase imports from other files

### 4. Update Context
Replace `src/context.jsx` with the updated version that uses the new API.

### 5. Update Components
Update the following components:
- `src/pages/landing.jsx` - Updated with new API calls
- `src/components/link-card.jsx` - Updated URL display
- `src/pages/link.jsx` - Updated link details page

### 6. Run Frontend Server
```bash
npm run dev
```
Frontend will run on `http://localhost:5173`

---

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### URL Management
- `POST /api/urls` - Create short URL (requires auth)
- `GET /api/urls` - Get all user URLs (requires auth)
- `GET /api/urls/:id` - Get specific URL (requires auth)
- `DELETE /api/urls/:id` - Delete URL (requires auth)
- `GET /api/urls/redirect/:id` - Get original URL for redirect

### Analytics
- `GET /api/analytics/clicks/:id` - Get clicks for specific URL (requires auth)
- `POST /api/analytics/clicks` - Get clicks for multiple URLs (requires auth)
- `POST /api/analytics/track` - Track click (no auth required)

### Redirect
- `GET /:id` - Redirect short URL to original URL

---

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  profile_pic: String,
  createdAt: Date
}
```

### ShortUrls Collection
```javascript
{
  _id: ObjectId,
  title: String,
  original_url: String,
  short_url: String (unique),
  custom_url: String (unique, optional),
  qr: String (base64),
  user_id: ObjectId (ref: User),
  created_at: Date
}
```

### Clicks Collection
```javascript
{
  _id: ObjectId,
  url_id: ObjectId (ref: ShortUrl),
  city: String,
  country: String,
  device: String,
  created_at: Date
}
```

---

## Key Changes from Supabase

### Authentication
- **Before**: Supabase Auth with built-in session management
- **After**: JWT tokens stored in localStorage
- Token is sent in Authorization header: `Bearer <token>`

### File Storage
- **Before**: Supabase Storage for profile pics and QR codes
- **After**: Base64 encoded strings stored in MongoDB
- QR codes generated server-side using `qrcode` package

### Real-time Updates
- **Before**: Supabase real-time subscriptions
- **After**: Manual refetch after mutations

### Row Level Security
- **Before**: Supabase RLS policies
- **After**: Express middleware authentication checks

---

## Testing the Application

### 1. Create an Account
1. Go to `http://localhost:5173`
2. Click "Login" button
3. Switch to "Signup" tab
4. Fill in name, email, password
5. Upload profile picture (optional)
6. Click "Create Account"

### 2. Create Short URL
1. After login, you'll be redirected to dashboard
2. Click "Create New Link"
3. Enter title and long URL
4. Optionally add custom URL
5. Click "Create"
6. View your shortened URL with QR code

### 3. Test Redirect
1. Copy the shortened URL
2. Open in new tab
3. Should redirect to original URL
4. Click is tracked in analytics

### 4. View Analytics
1. Go to dashboard
2. Click on any URL card
3. View click statistics, device info, and location data

---

## Deployment Guide

### Backend Deployment (AWS EC2)

1. **Launch EC2 Instance**
   - Choose Ubuntu Server
   - Configure security groups (open ports 80, 443, 3000)

2. **Install Dependencies**
   ```bash
   sudo apt update
   sudo apt install nodejs npm mongodb
   ```

3. **Setup Application**
   ```bash
   git clone <your-repo>
   cd backend
   npm install
   ```

4. **Configure Environment**
   - Update `.env` with production values
   - Use production MongoDB URL
   - Set strong JWT_SECRET

5. **Use PM2 for Process Management**
   ```bash
   npm install -g pm2
   pm2 start app.js
   pm2 startup
   pm2 save
   ```

6. **Setup Nginx Reverse Proxy**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Frontend Deployment

1. **Build for Production**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Hosting** (Vercel/Netlify/AWS S3)
   - Upload `dist` folder
   - Configure environment variables
   - Set up custom domain

3. **Update Environment Variables**
   ```env
   VITE_API_URL=https://api.your-domain.com/api
   VITE_APP_URL=https://api.your-domain.com
   ```

---

## Common Issues & Solutions

### Issue: CORS Error
**Solution**: Ensure backend CORS is configured correctly
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### Issue: MongoDB Connection Failed
**Solution**: Check MongoDB is running and connection string is correct

### Issue: Token Not Persisting
**Solution**: Check localStorage is working and token is being saved

### Issue: Redirect Not Working
**Solution**: Ensure short URL exists in database and redirect route is configured

### Issue: QR Code Not Generating
**Solution**: Check qrcode package is installed and canvas is available

---

## Production Considerations

1. **Security**
   - Use strong JWT_SECRET (64+ characters)
   - Enable HTTPS
   - Implement rate limiting
   - Sanitize user inputs
   - Use helmet.js for security headers

2. **Performance**
   - Add Redis caching for frequently accessed URLs
   - Index MongoDB fields (short_url, custom_url, user_id)
   - Compress responses with compression middleware
   - Use CDN for static assets

3. **Monitoring**
   - Setup error logging (Winston, Morgan)
   - Monitor server health
   - Track API response times
   - Set up alerts for failures

4. **Backup**
   - Regular MongoDB backups
   - Store backups in secure location
   - Test restore procedures

---

## Additional Features to Implement

1. **Link Expiration**: Add expiry date to URLs
2. **Password Protection**: Protect URLs with passwords
3. **Bulk Upload**: Create multiple URLs at once
4. **API Access**: Provide API keys for programmatic access
5. **Custom Domains**: Allow users to use custom domains
6. **Link Editing**: Edit existing URLs and titles
7. **Export Data**: Export analytics as CSV
8. **Email Notifications**: Send reports via email

---

## Support

For issues or questions:
- Check the API endpoint responses
- Review browser console for errors
- Check backend logs
- Ensure MongoDB is running
- Verify environment variables are set correctly
