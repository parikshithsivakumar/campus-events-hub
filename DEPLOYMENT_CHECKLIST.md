# 📋 DEPLOYMENT CHECKLIST

## What's Ready to Deploy
✅ Frontend (React + Vite)  
✅ Backend (Node.js + Express)  
✅ Database (MongoDB Atlas)  
✅ Venue Management System  
✅ Event Creation with Venue Selection  
✅ Token-based Authentication  

All code pushed to **main** branch: https://github.com/parikshithsivakumar/campus-events-hub

---

## DEPLOYMENT PLAN

### 🔵 Backend → Render

**1. Create Render Account**
- Go to https://render.com
- Sign up with GitHub
- Authorize `parikshithsivakumar/campus-events-hub`

**2. Create Web Service**
- Click "New" → "Web Service"
- Connect GitHub repo
- Branch: `main`

**3. Configure Build**
```
Build Command:   cd backend && npm install && npm run build
Start Command:   cd backend && npm start
Instance Type:   Free (for testing) or Starter ($7/month production)
Region:          Choose closest to your user base
```

**4. Add Secrets (Environment Variables)**
```
MONGODB_URI = mongodb://parikshithsr_demo:1122334455@ac-hseivsr-shard-00-00.s4tgsw3.mongodb.net:27017,ac-hseivsr-shard-00-01.s4tgsw3.mongodb.net:27017,ac-hseivsr-shard-00-02.s4tgsw3.mongodb.net:27017/?ssl=true&replicaSet=atlas-nh9j7s-shard-0&authSource=admin&appName=Cluster0

JWT_ACCESS_SECRET = event_mgmt_access_secret_dev_key_2024
JWT_REFRESH_SECRET = event_mgmt_refresh_secret_dev_key_2024
PORT = 4000
NODE_ENV = production
```

**5. Deploy**
- Click "Create Web Service"
- Wait 3-5 minutes
- Copy your Backend URL: **https://campus-events-hub-api.onrender.com**

**✓ Test Backend:**
```
https://campus-events-hub-api.onrender.com/health
→ Should return: {"status":"ok"}
```

---

### 🔴 Frontend → Vercel

**1. Create Vercel Account**
- Go to https://vercel.com
- Sign up with GitHub
- Authorize `parikshithsivakumar/campus-events-hub`

**2. Import Project**
- Click "Add New" → "Project"
- Select `campus-events-hub`

**3. Configure Settings**
```
Framework:         Vite
Root Directory:    frontend
Build Command:     npm run build
Output Directory:  dist
Install Command:   npm install
Node Version:      18.x (default)
```

**4. Add Environment Variables**
In "Environment Variables" section:
```
VITE_API_URL = https://campus-events-hub-api.onrender.com/api
```

**⚠️ IMPORTANT**: Use the Render backend URL you got in previous step

**5. Deploy**
- Click "Deploy"
- Wait 1-2 minutes
- Copy your Frontend URL: **https://campus-events-hub.vercel.app**

**✓ Test Frontend:**
```
https://campus-events-hub.vercel.app
→ Should load the login page
```

---

## TESTING AFTER DEPLOYMENT

### Test 1: Register Admin
1. Open https://campus-events-hub.vercel.app
2. Click "Register"
3. Fill details:
   - Email: `admin@college.edu`
   - Password: `Test@1234`
   - Name: `Admin User`
   - College Domain: `college.edu` ← **IMPORTANT**
   - Role: **COLLEGE_ADMIN**
4. Click "Register"
5. ✅ Should redirect to dashboard

### Test 2: Add Venue
1. In dashboard, click "Venues" (from navbar)
2. Click "+ Add Venue"
3. Fill details:
   - Name: `Main Auditorium`
   - Capacity: `500`
   - Location: `Building A, Floor 1`
   - Facilities: Select Wi-Fi, Projector
   - Amenities: Select Parking, Restroom
4. Click "Create"
5. ✅ Venue should appear in list

### Test 3: Register Student
1. Logout (top right menu)
2. Click "Register"
3. Fill details:
   - Email: `student@college.edu`
   - Password: `Test@1234`
   - Name: `Student User`
   - College Domain: `college.edu` ← **SAME DOMAIN AS ADMIN**
   - Role: **STUDENT_ORGANIZER**
4. Click "Register"
5. ✅ Should redirect to dashboard

### Test 4: Create Event with Venue
1. In student dashboard, click "Events"
2. Click "Create Event Proposal"
3. Select venue from dropdown:
   - ✅ Should see "Main Auditorium" added by admin
4. Fill other details:
   - Title: `Tech Summit 2024`
   - Department: `IT`
   - Start: Pick date/time
   - End: Pick later date/time
   - Budget: `50000`
   - Description: `Annual technology summit`
5. Click "Submit Proposal"
6. ✅ Event should be created with selected venue

---

## MONITORING & MAINTENANCE

### Monitor Backend
- Render Dashboard: https://dashboard.render.com
- Click your service to see logs
- Check "Metrics" for performance

### Monitor Frontend
- Vercel Dashboard: https://vercel.com/dashboard
- Click your project to see logs
- Check "Analytics" for usage

### Monitor Database
- MongoDB Atlas: https://cloud.mongodb.com
- Check connection metrics
- Backup important data

---

## AUTO-DEPLOYMENTS (CI/CD)

Both platforms automatically deploy when code is pushed to `main`:

```bash
git add .
git commit -m "Your message"
git push origin main

# Within 2-5 minutes:
# ✅ Backend redeployed on Render
# ✅ Frontend redeployed on Vercel
```

---

## FINAL DEPLOYMENT URLS

After deployment, you'll have:

| Service | URL |
|---------|-----|
| **Frontend** | https://campus-events-hub.vercel.app |
| **Backend API** | https://campus-events-hub-api.onrender.com |
| **Database** | MongoDB Atlas (connection handled by backend) |
| **GitHub Repo** | https://github.com/parikshithsivakumar/campus-events-hub |

---

## TROUBLESHOOTING

### Render Backend Issues

**"Failed to connect to MongoDB"**
- Check MongoDB_URI in environment variables
- Verify IP whitelist in MongoDB Atlas
- Ensure `mongodb` URI includes all credentials

**"Port already in use"**
- Render manages ports automatically
- Remove hardcoded port, use `process.env.PORT`
- Should already be set in code ✅

### Vercel Frontend Issues

**"API calls failing (CORS error)"**
- Verify backend is running on Render
- Check `VITE_API_URL` environment variable
- Should be: `https://campus-events-hub-api.onrender.com/api`

**"Build failed - Module not found"**
- Check build logs in Vercel dashboard
- Ensure `npm install` completes
- Verify all dependencies in package.json

### General Issues

| Error | Solution |
|-------|----------|
| 404 on Frontend | Wait for Vercel build (check logs) |
| 502 on Backend | Wait for Render deployment or check logs |
| No venues showing | Verify both users have same `college.edu` domain |
| Can't login | Check JWT tokens in browser console |

---

## NEXT STEPS (OPTIONAL)

1. **Add custom domain**
   - Vercel: Settings → Domains
   - Render: Web Service → Custom Domain

2. **SSL Certificate**
   - Auto-generated by both platforms ✅

3. **Scale Application**
   - Upgrade Render plan for better performance
   - Add database backups in MongoDB

4. **Monitor Performance**
   - Set up alerts in Render dashboard
   - Track usage in Vercel analytics

---

## SUCCESS CHECKLIST

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] VITE_API_URL correctly set in Vercel
- [ ] MongoDB connection working
- [ ] Admin can register and add venues
- [ ] Student can see venues in event creation
- [ ] Events can be created with venue selection
- [ ] Venues dropdown is working properly

Once all checked ✅, deployment is complete!

---

**Questions?** See detailed guides:
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Detailed setup
- [DEPLOY_QUICK_START.md](./DEPLOY_QUICK_START.md) - Quick reference
