# 🚀 Quick Start Guide - SIS Transport Management System

## Get Up and Running in 30 Minutes!

This guide will help you deploy the complete SIS Transport Management System quickly.

## ⚡ 5-Step Quick Deployment

### Step 1: Prepare Google Sheets (10 minutes)

1. **Create a new Google Spreadsheet**
   - Go to sheets.google.com
   - Create new sheet: "SIS Transport System Database"
   - Save the Spreadsheet ID from URL

2. **Create these 6 sheets (tabs)**:
   ```
   1. Students
   2. Transport_Registrations
   3. Buses
   4. Routes
   5. Teachers
   6. SMS_Templates
   ```

3. **Add headers to each sheet** (copy from DEPLOYMENT.md)

4. **Import your existing data** to Students sheet

### Step 2: Deploy Google Apps Script (5 minutes)

1. In your spreadsheet: Extensions → Apps Script
2. Copy files from `google-apps-script/` folder
3. In Project Settings, add Script Property:
   - Key: `SPREADSHEET_ID`
   - Value: Your spreadsheet ID
4. Deploy → New deployment → Web app
5. Copy the Web App URL

### Step 3: Set Up Local Environment (5 minutes)

```bash
# Navigate to project
cd sis-transport-system

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local with your values
```

In `.env.local`:
```env
GOOGLE_SHEET_ID=your_spreadsheet_id_here
NEXT_PUBLIC_APPS_SCRIPT_URL=your_web_app_url_here
NEXT_PUBLIC_SCHOOL_NAME="Shantiniketan Indian School Qatar"
```

### Step 4: Test Locally (5 minutes)

```bash
# Start development server
npm run dev

# Open http://localhost:3000
# Test search, registration, reports
```

### Step 5: Deploy to Vercel (5 minutes)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Deploy to production
vercel --prod
```

## 🎯 What You Get

After these 5 steps, you'll have:
- ✅ Live web application
- ✅ Working transport registration
- ✅ PDF report generation
- ✅ Search functionality
- ✅ Admin panel for management
- ✅ Mobile-responsive interface

## 📊 Test with Sample Data

Add this test student to your Students sheet:
```
P12299 | AAIRAH MARIYAM | 1 | 1A | FN | 55555555 | 66666666 | Doha | Parent Name
```

Add this test bus to your Buses sheet:
```
5 | 50 | ROUTE 09 | RASHEED | 30523566 | ASGAR | 70869066 | | FN
```

Add this test route to your Routes sheet:
```
ROUTE 09 | M KHALIFA NT | Stop 1, Stop 2, Stop 3 | 15 km | Al Gharrafa
```

Now try:
1. Search for "AAIRAH"
2. Register AAIRAH for Bus 5
3. Generate attendance sheet for Bus 5

## 🐛 Quick Troubleshooting

### Issue: "Student not found"
**Fix**: Check enrollment number has no spaces, matches exactly

### Issue: "Apps Script error"
**Fix**: Re-deploy script, check authorization, verify Spreadsheet ID

### Issue: "PDF not generating"
**Fix**: Check browser console, clear cache, try different browser

### Issue: "Can't save to Google Sheets"
**Fix**: Check script deployment permissions, verify sheet names

## 📱 SMS Integration (Optional)

To enable SMS:

1. **Get SMS Provider** (Unifonic recommended for Qatar)
2. **Get API Key** from provider
3. **Update Code.gs** `sendSMS` function:

```javascript
function sendSMS(phoneNumber, message) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('SMS_API_KEY');
  const url = 'https://api.unifonic.com/v1/messages/send';
  
  const payload = {
    recipient: phoneNumber,
    body: message,
    sender: 'SIS'
  };
  
  const options = {
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + apiKey
    },
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  };
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    return JSON.parse(response.getContentText());
  } catch (error) {
    Logger.log('SMS Error: ' + error);
    throw error;
  }
}
```

4. **Add API Key** to Script Properties in Apps Script

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    600: '#your-color',
    // ...
  }
}
```

### Change School Name
Edit `.env.local`:
```env
NEXT_PUBLIC_SCHOOL_NAME="Your School Name"
```

### Add Logo
1. Add `logo.png` to `public/` folder
2. Update `src/components/layout/Navbar.tsx`

## 📈 Usage Tips

### For Daily Operations:
1. **Morning**: Check dashboard for today's statistics
2. **New Registration**: Go to Registration → Enter enrollment → Fill form
3. **Generate Reports**: Attendance → Select bus → Select dates → Download PDF
4. **Search Student**: Search → Enter name/number → View details

### For Admin Tasks:
1. **Add Bus**: Admin → Buses → Add New
2. **Add Route**: Admin → Routes → Add New
3. **Assign Teacher**: Admin → Buses → Edit → Select Teacher
4. **View Statistics**: Dashboard → Bus Summary

## 🔗 Important Links

After deployment, bookmark:
- Production URL: https://your-app.vercel.app
- Google Sheet: [Your spreadsheet URL]
- Apps Script: [Your script URL]
- Vercel Dashboard: https://vercel.com/dashboard

## 📞 Need Help?

1. **Check DEPLOYMENT.md** - Detailed instructions
2. **Check PROJECT_SUMMARY.md** - Complete feature list
3. **Check README.md** - API documentation
4. **Browser Console** - F12 for error messages
5. **Apps Script Logs** - View → Logs in Apps Script editor

## ✅ Launch Checklist

Before going live:
- [ ] Import all student data
- [ ] Add all buses and routes
- [ ] Test registration with 5 students
- [ ] Generate and verify 3 attendance sheets
- [ ] Test search with 10 different queries
- [ ] Verify all PDFs print correctly
- [ ] Train 2 staff members
- [ ] Create backup of Google Sheet
- [ ] Document any custom processes
- [ ] Add support contact information

## 🎉 You're Ready!

Your transport management system is now live and ready to:
- Replace manual Excel processes
- Save hours of administrative time
- Provide instant access to transport data
- Generate professional reports
- Track attendance efficiently
- Communicate changes via SMS

## 🚀 Next Steps After Launch

Week 1:
- Monitor daily usage
- Gather user feedback
- Fix any issues quickly

Month 1:
- Analyze usage patterns
- Optimize common workflows
- Train additional staff

Quarter 1:
- Review system performance
- Plan Phase 2 enhancements
- Consider mobile app

---

**🎊 Congratulations on deploying your new Transport Management System!**

For additional support, refer to:
- DEPLOYMENT.md (detailed guide)
- PROJECT_SUMMARY.md (complete features)
- README.md (technical documentation)
