# 🚀 Complete Setup Instructions

## Prerequisites
- Node.js (v16 or higher)
- MongoDB installed and running locally
- npm or yarn package manager

---

## 📦 BACKEND SETUP

### Step 1: Install Backend Dependencies

```bash
cd Backend
npm install
```

### Step 2: Install Additional Required Packages

```bash
npm install bcryptjs jsonwebtoken cors qrcode
```

### Step 3: Create .env File

Create a file `Backend/.env` with:

```env
MONGO_URL=mongodb://localhost:27017/url-shortener
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
APP_URL=http://localhost:3000/
FRONTEND_URL=http://localhost:5173
PORT=3000
```

⚠️ **Important**: Change `JWT_SECRET` to a strong random string in production!

### Step 4: Verify MongoDB is Running

```bash
# Check if MongoDB is running
mongosh

# OR start MongoDB
mongod
```

### Step 5: Start Backend Server

```bash
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
Server running on http://localhost:3000
```

---

## 🎨 FRONTEND SETUP

### Step 1: Install Frontend Dependencies

```bash
cd Frontend1
npm install
```

### Step 2: Remove Supabase Dependencies (Optional)

```bash
npm uninstall @supabase/supabase-js
```

### Step 3: Create/Update .env File

Create/update `Frontend1/.env` with:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_URL=http://localhost:3000
```

### Step 4: Delete Old Supabase File

```bash
rm src/db/supabase.js
```

### Step 5: Start Frontend Development Server

```bash
npm run dev
```

You should see:
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## 🧪 Testing the Application

### 1. Test Backend Health

Open browser or use curl:
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{"status":"OK","message":"Server is running"}
```

### 2. Test User Signup

Go to: `http://localhost:5173/auth`

- Click "Signup" tab
- Fill in:
  - Name: Test User
  - Email: test@example.com
  - Password: test123
  - Upload a profile picture
- Click "Create Account"

✅ Should redirect to dashboard

### 3. Test URL Shortening

On dashboard:
- Click "Create New Link"
- Fill in:
  - Title: My First Link
  - Long URL: https://www.example.com
  - Custom URL: mylink (optional)
- Click "Create"

✅ Should create URL and redirect to link details page

### 4. Test Short URL Redirect

Go to: `http://localhost:3000/mylink`

✅ Should redirect to https://www.example.com

### 5. Test Analytics

- Go to link details page
- Click on the short link to generate a click
- Refresh the page
- Check "Stats" section

✅ Should show 1 click with device and location info

---

## 📁 File Structure Overview

```
Project/
│
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── mongo.config.js
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   ├── shortUrlSchema.model.js
│   │   │   └── click.model.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── short_url.controller.js
│   │   │   └── analytics.controller.js
│   │   ├── routes/
│   │   │   ├── auth.route.js
│   │   │   ├── shortUrl.route.js
│   │   │   ├── analytics.route.js
│   │   │   └── redirect.route.js
│   │   └── middleware/
│   │       └── auth.middleware.js
│   ├── app.js
│   ├── package.json
│   └── .env
│
└── Frontend1/
    ├── src/
    │   ├── components/
    │   │   ├── login.jsx ✏️ UPDATED
    │   │   ├── signup.jsx ✏️ UPDATED
    │   │   ├── create-link.jsx ✏️ UPDATED
    │   │   ├── link-card.jsx ✏️ UPDATED
    │   │   └── ... (other components)
    │   ├── pages/
    │   │   ├── dashboard.jsx ✏️ UPDATED
    │   │   ├── link.jsx ✏️ UPDATED
    │   │   ├── redirect-link.jsx ✏️ UPDATED
    │   │   └── ... (other pages)
    │   ├── db/
    │   │   ├── apiClient.js ⭐ NEW
    │   │   ├── apiAuth.js ✏️ UPDATED
    │   │   ├── apiUrls.js ✏️ UPDATED
    │   │   └── apiClicks.js ✏️ UPDATED
    │   ├── context.jsx ✏️ UPDATED
    │   └── ...
    ├── package.json
    └── .env
```

---

## 🔧 Common Issues & Solutions

### Issue 1: MongoDB Connection Failed

**Error**: `❌ MongoDB connection failed`

**Solution**:
```bash
# Start MongoDB
mongod

# OR if using Homebrew on Mac
brew services start mongodb-community
```

### Issue 2: JWT Token Invalid

**Error**: `Invalid token` or `Authentication required`

**Solution**:
- Clear browser localStorage
- Log out and log back in
- Check JWT_SECRET is set in backend .env

### Issue 3: CORS Error

**Error**: `Access to fetch blocked by CORS policy`

**Solution**:
- Verify FRONTEND_URL in backend .env matches your frontend URL
- Check cors middleware is properly configured in app.js

### Issue 4: Profile Picture Not Displaying

**Issue**: Profile picture shows broken image

**Solution**:
- Ensure image is being converted to base64 in signup
- Check browser console for base64 string format
- Verify image size is reasonable (< 5MB)

### Issue 5: QR Code Not Generating

**Error**: QR code shows placeholder

**Solution**:
```bash
# Install qrcode package in backend
cd Backend
npm install qrcode
```

### Issue 6: Port Already in Use

**Error**: `Port 3000 is already in use`

**Solution**:
```bash
# Find and kill process using port 3000
# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# OR change port in backend .env
PORT=3001
```

---

## 🔐 Security Checklist for Production

Before deploying to production:

- [ ] Change JWT_SECRET to a strong random string
- [ ] Enable HTTPS
- [ ] Use httpOnly cookies instead of localStorage for tokens
- [ ] Add rate limiting
- [ ] Add input validation on backend
- [ ] Enable MongoDB authentication
- [ ] Use environment-specific .env files
- [ ] Add helmet.js for security headers
- [ ] Implement password reset functionality
- [ ] Add email verification
- [ ] Set up proper error logging
- [ ] Configure CORS for specific domains only

---

## 📊 API Endpoints Reference

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout user (protected)

### URLs
- `POST /api/urls` - Create short URL (protected)
- `GET /api/urls` - Get all user's URLs (protected)
- `GET /api/urls/:id` - Get single URL (protected)
- `DELETE /api/urls/:id` - Delete URL (protected)

### Analytics
- `GET /api/analytics/clicks/:id` - Get clicks for URL (protected)
- `GET /api/analytics/device/:id` - Get device stats (protected)
- `GET /api/analytics/location/:id` - Get location stats (protected)
- `GET /api/analytics/user` - Get user analytics (protected)

### Public
- `GET /:shortCode` - Redirect to original URL (public)

---

## 🎯 Next Steps

1. **Test all features thoroughly**
2. **Add more validations** (email format, URL format, etc.)
3. **Implement password reset** via email
4. **Add bulk URL creation**
5. **Export analytics to CSV**
6. **Add URL expiration dates**
7. **Implement custom domains**
8. **Add team collaboration features**

---

## 📞 Need Help?

If you encounter any issues:

1. Check browser console for errors
2. Check backend terminal for error logs
3. Verify MongoDB is running
4. Ensure all dependencies are installed
5. Check .env files are properly configured

Good luck! 🚀



# 📋 Complete Files Checklist

## ⭐ BACKEND - New Files to Create

```
Backend/
├── src/
│   ├── models/
│   │   ├── user.model.js ⭐ NEW
│   │   ├── click.model.js ⭐ NEW
│   │   └── shortUrlSchema.model.js ✏️ UPDATE
│   │
│   ├── controllers/
│   │   ├── auth.controller.js ⭐ NEW
│   │   ├── analytics.controller.js ⭐ NEW
│   │   └── short_url.controller.js ✏️ UPDATE
│   │
│   ├── routes/
│   │   ├── auth.route.js ⭐ NEW
│   │   ├── analytics.route.js ⭐ NEW
│   │   ├── redirect.route.js ⭐ NEW
│   │   └── shortUrl.route.js ✏️ UPDATE
│   │
│   ├── middleware/
│   │   └── auth.middleware.js ⭐ NEW
│   │
│   └── config/
│       └── mongo.config.js ✅ KEEP AS IS
│
├── app.js ✏️ UPDATE
├── package.json ✏️ UPDATE (add dependencies)
└── .env ✏️ UPDATE (add JWT_SECRET, etc.)
```

## 🎨 FRONTEND - Files to Create/Update

```
Frontend1/
├── src/
│   ├── db/
│   │   ├── apiClient.js ⭐ NEW
│   │   ├── apiAuth.js ✏️ REPLACE
│   │   ├── apiUrls.js ✏️ REPLACE
│   │   ├── apiClicks.js ✏️ REPLACE
│   │   └── supabase.js ❌ DELETE
│   │
│   ├── components/
│   │   ├── login.jsx ✏️ UPDATE
│   │   ├── signup.jsx ✏️ UPDATE
│   │   ├── create-link.jsx ✏️ UPDATE
│   │   └── link-card.jsx ✏️ UPDATE
│   │
│   ├── pages/
│   │   ├── dashboard.jsx ✏️ UPDATE
│   │   ├── link.jsx ✏️ UPDATE
│   │   └── redirect-link.jsx ✏️ UPDATE
│   │
│   ├── context.jsx ✏️ UPDATE
│   └── hooks/
│       └── use-fetch.js ✅ KEEP AS IS
│
└── .env ✏️ UPDATE
```

---

## 🔄 Migration Steps Summary

### Step 1: Backend Setup
1. ✅ Create `user.model.js`
2. ✅ Create `click.model.js`
3. ✅ Update `shortUrlSchema.model.js`
4. ✅ Create `auth.controller.js`
5. ✅ Create `analytics.controller.js`
6. ✅ Update `short_url.controller.js`
7. ✅ Create `auth.middleware.js`
8. ✅ Create all route files
9. ✅ Update `app.js`
10. ✅ Update `package.json` dependencies
11. ✅ Update `.env`

### Step 2: Frontend Setup
1. ✅ Create `apiClient.js`
2. ✅ Replace `apiAuth.js`
3. ✅ Replace `apiUrls.js`
4. ✅ Replace `apiClicks.js`
5. ✅ Delete `supabase.js`
6. ✅ Update all components
7. ✅ Update all pages
8. ✅ Update `context.jsx`
9. ✅ Update `.env`

### Step 3: Install Dependencies
```bash
# Backend
cd Backend
npm install bcryptjs jsonwebtoken cors qrcode

# Frontend
cd Frontend1
npm uninstall @supabase/supabase-js
```

### Step 4: Test Everything
- [ ] Signup works
- [ ] Login works
- [ ] Create URL works
- [ ] View URLs works
- [ ] Delete URL works
- [ ] Redirect works
- [ ] Analytics works

---

## 🗂️ Files NOT to Change

Keep these files as they are:

**Backend:**
- ✅ `src/config/mongo.config.js`
- ✅ `src/utils/helper.js`

**Frontend:**
- ✅ All UI components in `components/ui/`
- ✅ `src/hooks/use-fetch.js`
- ✅ `src/lib/utils.js`
- ✅ All layout files
- ✅ `tailwind.config.js`
- ✅ `vite.config.js`
- ✅ All other unchanged components

---

## 📦 Package Dependencies

### Backend package.json additions:
```json
{
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "jsonwebtoken": "^9.0.2",
    "qrcode": "^1.5.3"
  }
}
```

### Frontend package.json removals:
```json
{
  "dependencies": {
    "@supabase/supabase-js": "REMOVE THIS"
  }
}
```

---

## 🎯 Quick Copy-Paste Commands

### Backend Setup
```bash
cd Backend
npm install bcryptjs jsonwebtoken cors qrcode
touch src/models/user.model.js
touch src/models/click.model.js
touch src/controllers/auth.controller.js
touch src/controllers/analytics.controller.js
touch src/routes/auth.route.js
touch src/routes/analytics.route.js
touch src/routes/redirect.route.js
touch src/middleware/auth.middleware.js
```

### Frontend Setup
```bash
cd Frontend1
npm uninstall @supabase/supabase-js
touch src/db/apiClient.js
rm src/db/supabase.js
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] MongoDB is running (`mongosh` connects)
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] No console errors in browser
- [ ] Can access `http://localhost:5173`
- [ ] Can access `http://localhost:3000/api/health`
- [ ] Signup creates user in MongoDB
- [ ] Login returns JWT token
- [ ] URLs are created in MongoDB
- [ ] Short URLs redirect correctly
- [ ] Analytics are tracked

---

## 🐛 Debug Commands

```bash
# Check MongoDB connection
mongosh

# Show databases
show dbs

# Use your database
use url-shortener

# Show collections
show collections

# Check users
db.users.find()

# Check URLs
db.shorturls.find()

# Check clicks
db.clicks.find()

# Clear all data (if needed)
db.users.deleteMany({})
db.shorturls.deleteMany({})
db.clicks.deleteMany({})
```

---

## 🚀 You're All Set!

If you followed all steps, your application should now be working with MongoDB instead of Supabase!
