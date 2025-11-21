# SIS Transport Management System - Deployment Guide

## 📋 Prerequisites

1. **Google Account** with access to Google Sheets and Google Apps Script
2. **Node.js** (v18 or higher)
3. **npm** or **yarn**
4. **Vercel Account** (free tier works)
5. **Git** for version control

## 🔧 Part 1: Google Sheets Backend Setup

### Step 1: Create Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named **"SIS Transport System Database"**
3. Copy the Spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```
4. Save this ID - you'll need it later

### Step 2: Create Required Sheets

Create the following sheets (tabs) with these exact names and headers:

#### Sheet 1: Students
```
Enrollment No | Name | Class | Division | Shift | Contact No 1 | Contact No 2 | Address | Parent Name
```

#### Sheet 2: Transport_Registrations
```
Enrollment No | Bus Number | Route Number | Stop Name | Registration Date | Status | Cancellation Date | Last Updated
```

#### Sheet 3: Buses
```
Bus Number | Capacity | Route Number | Driver Name | Driver Contact | Conductor Name | Conductor Contact | Teacher Assigned | Shift
```

#### Sheet 4: Routes
```
Route Number | Route Name | Stops | Total Distance | Area
```

#### Sheet 5: Teachers
```
Teacher ID | Name | Contact | Subject | Assigned Bus
```

#### Sheet 6: SMS_Templates
```
Template Type | Template Text | Variables
```

### Step 3: Import Your Existing Data

1. Open your existing transport data spreadsheet
2. Copy student data to the **Students** sheet
3. Format data to match the column headers exactly
4. Ensure:
   - Enrollment numbers are unique
   - Shift values are exactly "FN" or "AN"
   - Contact numbers are in Qatar format

### Step 4: Set Up Google Apps Script

1. In your spreadsheet, go to **Extensions** > **Apps Script**
2. Delete the default `Code.gs` file content
3. Create the following files by clicking the **+** button:

   - **Code.gs** - Copy from `google-apps-script/Code.gs`
   - **Students.gs** - Copy from `google-apps-script/Students.gs`
   - **Transport.gs** - Copy from `google-apps-script/Transport.gs`
   - **Buses.gs** - Copy from `google-apps-script/Buses.gs` (create this)
   - **Routes.gs** - Copy from `google-apps-script/Routes.gs` (create this)
   - **Reports.gs** - Copy from `google-apps-script/Reports.gs` (create this)

4. In the Apps Script editor:
   - Click on **Project Settings** (gear icon)
   - Under "Script Properties", add:
     ```
     SPREADSHEET_ID = [Your Spreadsheet ID]
     ```

5. **Deploy as Web App:**
   - Click **Deploy** > **New deployment**
   - Select **Web app** as deployment type
   - Set "Execute as" to **Me**
   - Set "Who has access" to **Anyone**
   - Click **Deploy**
   - **Copy the Web App URL** - you'll need this!

6. **Authorize the script:**
   - The first time you deploy, you'll need to authorize
   - Click "Review permissions"
   - Select your Google account
   - Click "Advanced" if you see a warning
   - Click "Go to [Project name] (unsafe)"
   - Click "Allow"

### Step 5: Test the Apps Script

1. In the spreadsheet, you should see a new menu: **Transport System**
2. Click **Transport System** > **Test API**
3. Check the execution log (View > Logs) for any errors
4. If successful, you'll see student and bus data logged

## 🚀 Part 2: Next.js Frontend Setup

### Step 1: Clone/Download the Project

```bash
# If using Git
git clone [repository-url]
cd sis-transport-system

# Or if downloaded as ZIP
unzip sis-transport-system.zip
cd sis-transport-system
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Google Sheets Configuration
GOOGLE_SHEET_ID=your_spreadsheet_id_here
GOOGLE_CLIENT_EMAIL=your_service_account_email@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----\n"

# Google Apps Script Web App URL
NEXT_PUBLIC_APPS_SCRIPT_URL=your_apps_script_web_app_url_here

# Application Settings
NEXT_PUBLIC_APP_NAME="SIS Transport Management"
NEXT_PUBLIC_SCHOOL_NAME="Shantiniketan Indian School Qatar"

# Authentication (Optional - for future implementation)
NEXTAUTH_SECRET=your_random_secret_here
NEXTAUTH_URL=http://localhost:3000

# SMS Provider (Optional - integrate your SMS service)
SMS_API_KEY=your_sms_api_key
SMS_API_URL=your_sms_provider_url
```

### Step 4: Configure Google Service Account (Optional - for Direct API Access)

If you want direct Google Sheets API access (not just Apps Script):

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable **Google Sheets API**
4. Go to **APIs & Services** > **Credentials**
5. Click **Create Credentials** > **Service Account**
6. Fill in details and create
7. Click on the service account email
8. Go to **Keys** tab
9. Click **Add Key** > **Create new key** > **JSON**
10. Download the JSON file
11. Copy the `client_email` and `private_key` to your `.env.local`
12. Share your Google Spreadsheet with the service account email (Editor access)

### Step 5: Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 6: Test Core Features

1. **Dashboard**: Should show statistics
2. **Search**: Try searching for a student by enrollment number
3. **Registration**: Try registering a student for transport
4. **Bus Management**: View and manage buses
5. **Reports**: Generate an attendance sheet

## 🌐 Part 3: Deploy to Vercel

### Step 1: Prepare for Deployment

1. Ensure your code is in a Git repository
2. Push to GitHub/GitLab/Bitbucket:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin [your-repo-url]
git push -u origin main
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click **New Project**
3. Import your Git repository
4. Configure:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Add Environment Variables:
   - Copy all variables from `.env.local`
   - Add them in the Environment Variables section
6. Click **Deploy**

### Step 3: Configure Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click **Settings** > **Domains**
3. Add your domain (e.g., `transport.sisqatar.com`)
4. Follow DNS configuration instructions
5. Wait for SSL certificate to provision

## 🔒 Part 4: Security Configuration

### Step 1: Restrict Apps Script Access

1. In Apps Script, go to **Deploy** > **Manage deployments**
2. Click on your deployment
3. Change "Who has access" to **Only myself** if you want stricter control
4. Update API calls to include authentication

### Step 2: Set Up Authentication (Recommended)

Implement NextAuth.js for user authentication:

```bash
npm install next-auth
```

Create `src/app/api/auth/[...nextauth]/route.ts` with your auth configuration.

### Step 3: Environment Security

- Never commit `.env.local` to Git
- Add `.env*.local` to `.gitignore`
- Rotate API keys regularly
- Use Vercel's environment variable encryption

## 📱 Part 5: SMS Integration (Optional)

To enable SMS notifications:

### Option 1: Qatar-based SMS Providers

- **Unifonic**: https://unifonic.com
- **Ooredoo Business**: SMS Gateway
- **Vodafone Qatar**: Business SMS

### Option 2: Integration Steps

1. Sign up with an SMS provider
2. Get API credentials
3. Update `.env.local` with SMS API details
4. Update `google-apps-script/Code.gs` `sendSMS` function:

```javascript
function sendSMS(phoneNumber, message) {
  const url = 'YOUR_SMS_PROVIDER_URL';
  const apiKey = PropertiesService.getScriptProperties().getProperty('SMS_API_KEY');
  
  const payload = {
    to: phoneNumber,
    message: message,
    apiKey: apiKey
  };
  
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  };
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    return JSON.parse(response.getContentText());
  } catch (error) {
    Logger.log('SMS Error: ' + error.toString());
    throw error;
  }
}
```

## 🧪 Part 6: Testing

### Test Checklist

- [ ] Student search functionality
- [ ] Transport registration
- [ ] Duplicate detection
- [ ] Transport cancellation
- [ ] Bus management (CRUD)
- [ ] Route management (CRUD)
- [ ] Attendance sheet generation
- [ ] Route sheet generation
- [ ] PDF downloads
- [ ] Dashboard statistics
- [ ] Mobile responsiveness

### Sample Test Data

Use the following test data:

```javascript
{
  enrollmentNo: "P12299",
  busNumber: "5",
  routeNumber: "ROUTE 09",
  stopName: "M KHALIFA NT"
}
```

## 🐛 Troubleshooting

### Common Issues

1. **"Student not found" error**
   - Check enrollment number format in spreadsheet
   - Ensure no extra spaces
   - Verify sheet name is exactly "Students"

2. **Apps Script permission denied**
   - Re-authorize the script
   - Check sharing permissions on spreadsheet
   - Ensure service account has Editor access

3. **API calls failing**
   - Verify Apps Script Web App URL in `.env.local`
   - Check CORS settings
   - Ensure deployment is set to "Anyone" access

4. **PDF generation issues**
   - Clear browser cache
   - Check browser console for errors
   - Ensure jsPDF dependencies are installed

5. **Vercel deployment fails**
   - Check build logs
   - Verify all environment variables are set
   - Ensure Node.js version compatibility

## 📞 Support

For technical issues:
1. Check the logs in Google Apps Script
2. Check browser console (F12)
3. Check Vercel deployment logs
4. Review this documentation

## 🔄 Maintenance

### Regular Tasks

1. **Weekly**: Check system logs for errors
2. **Monthly**: Review and archive old registrations
3. **Quarterly**: Update student database
4. **Annually**: Review and optimize Google Sheets structure

### Backup Strategy

1. **Google Sheets**: Automatic backup via Google Drive
2. **Code**: Version control with Git
3. **Environment Variables**: Secure documentation
4. **Database**: Weekly exports to Excel

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Google Apps Script Guides](https://developers.google.com/apps-script)
- [Vercel Documentation](https://vercel.com/docs)
- [Google Sheets API](https://developers.google.com/sheets/api)

---

**Congratulations! Your SIS Transport Management System is now deployed and ready to use!** 🎉
