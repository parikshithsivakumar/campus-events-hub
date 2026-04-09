# 🚀 DEPLOYMENT QUICK START

## Summary
Deploy Campus Events Hub in **2 platforms**:
- **Frontend** → Vercel (React app)
- **Backend** → Render (Node.js API)

---

## STEP 1: Prepare Main Branch

```bash
git checkout main
git merge fix/venue-token-key
git push origin main
```

---

## STEP 2: Deploy Backend to Render

1. **Go to**: https://render.com
2. **Sign up** with GitHub
3. **Click**: "New" → "Web Service"
4. **Select**: `parikshithsivakumar/campus-events-hub` repo
5. **Configure**:
   - Name: `campus-events-hub-api`
   - Environment: `Node`
   - Branch: `main`
   - Build Command: `cd backend && npm install && npm run build`
   - Start Command: `cd backend && npm start`
   - Publish Port: `4000` (default)

6. **Add Environment Variables**:
   ```
   MONGODB_URI = [your MongoDB connection string]
   JWT_ACCESS_SECRET = event_mgmt_access_secret_dev_key_2024
   JWT_REFRESH_SECRET = event_mgmt_refresh_secret_dev_key_2024
   NODE_ENV = production
   PORT = 4000
   ```

7. **Click**: "Create Web Service"
8. **Wait**: ~3-5 minutes for deployment
9. **Get URL**: `https://campus-events-hub-api.onrender.com`

✅ Test: https://campus-events-hub-api.onrender.com/health

---

## STEP 3: Deploy Frontend to Vercel

1. **Go to**: https://vercel.com
2. **Sign up** with GitHub
3. **Click**: "Add New" → "Project"
4. **Select**: `campus-events-hub` repo
5. **Configure**:
   - Framework: `Vite`
   - Root Directory: `./frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

6. **Add Environment Variables**:
   ```
   VITE_API_URL = https://campus-events-hub-api.onrender.com/api
   ```

7. **Click**: "Deploy"
8. **Wait**: ~1-2 minutes
9. **Get URL**: `https://campus-events-hub.vercel.app` (or custom)

✅ Test: https://campus-events-hub.vercel.app

---

## STEP 4: Test Complete Flow

1. Open: https://campus-events-hub.vercel.app
2. **Register** as COLLEGE_ADMIN
   - Email: admin@college.edu
   - Password: Test@1234
   - College Domain: **college.edu** ← IMPORTANT
   - Role: COLLEGE_ADMIN

3. **Add Venues** (logo → Venues → + Add Venue)
   - Name: Main Auditorium
   - Capacity: 500
   - Location: Building A

4. **Logout** and **Register** as STUDENT_ORGANIZER
   - Email: student@college.edu
   - Password: Test@1234
   - College Domain: **college.edu** ← SAME DOMAIN
   - Role: STUDENT_ORGANIZER

5. **Create Event**
   - Go to Events tab
   - Venue dropdown should show "Main Auditorium" ✅
   - Fill in other details
   - Submit

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **Backend won't start** | Check Render logs → Verify MongoDB URI, env vars |
| **Frontend shows 404** | Vercel logs → Check build succeeded |
| **API connection error** | Verify `VITE_API_URL` in Vercel env vars |
| **Venues not showing** | Check JWT token in browser console |
| **CORS error** | Backend `app.ts` has CORS enabled by default |

---

## URLs After Deployment

```
Frontend:  https://campus-events-hub.vercel.app
Backend:   https://campus-events-hub-api.onrender.com
GitHub:    https://github.com/parikshithsivakumar/campus-events-hub
```

---

## Auto-Deployments

✅ Both platforms automatically deploy when you push to `main` branch

```bash
git push origin main  # Auto-deploys to Vercel & Render
```

---

## Next: Custom Domain (Optional)

**Vercel Custom Domain**:
- Vercel Dashboard → Settings → Domains → Add domain

**Render Custom Domain**:
- Render Dashboard → Web Service → Settings → Custom Domain

---

**Questions?** Check DEPLOYMENT.md for detailed guide
