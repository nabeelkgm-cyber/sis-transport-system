# School Transport Management System - Architecture

## System Overview
Full-stack web application for Shantiniketan Indian School Qatar transport management using Google Sheets as the backend database.

## Tech Stack
- **Frontend**: React with Next.js 14 (App Router)
- **Backend**: Google Apps Script + Next.js API Routes
- **Database**: Google Sheets API
- **Styling**: Tailwind CSS
- **PDF Generation**: jsPDF + html2canvas
- **State Management**: React Context API
- **Authentication**: Google OAuth 2.0
- **Deployment**: Vercel

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client (React/Next.js)                  │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐  │
│  │Transport │Attendance│  Route   │  Search  │  Admin   │  │
│  │Registration│ Sheet  │  Sheets  │  Engine  │  Panel   │  │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│              Next.js API Routes (Middleware)                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  • Authentication & Authorization                    │  │
│  │  • Request Validation                                │  │
│  │  • Error Handling                                    │  │
│  │  • Rate Limiting                                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│           Google Apps Script (Backend Logic)                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  • CRUD Operations                                   │  │
│  │  • Data Validation                                   │  │
│  │  • Duplicate Detection                               │  │
│  │  • SMS Template Generation                           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                  Google Sheets (Database)                   │
│  ┌────────────┬──────────┬──────────┬──────────┬────────┐  │
│  │  Students  │   Buses  │  Routes  │ Drivers  │Teachers│  │
│  │    FN/AN   │          │          │Conductors│        │  │
│  └────────────┴──────────┴──────────┴──────────┴────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema (Google Sheets)

### Sheet 1: Students Master
```
- Enrollment No (Primary Key)
- Name
- Class
- Division
- Shift (FN/AN)
- Contact No 1
- Contact No 2
- Address
- Parent Name
```

### Sheet 2: Transport Registrations
```
- Enrollment No (Foreign Key)
- Bus Number
- Route Number
- Stop Name
- Registration Date
- Status (Active/Cancelled)
- Cancellation Date
- Last Updated
```

### Sheet 3: Buses
```
- Bus Number (Primary Key)
- Capacity
- Route Number
- Driver Name
- Driver Contact
- Conductor Name
- Conductor Contact
- Teacher Assigned
- Shift (FN/AN)
```

### Sheet 4: Routes
```
- Route Number (Primary Key)
- Route Name
- Stops (Comma-separated)
- Total Distance
- Area
```

### Sheet 5: Teachers
```
- Teacher ID
- Name
- Contact
- Subject
- Assigned Bus
```

### Sheet 6: SMS Templates
```
- Template Type
- Template Text
- Variables
```

## Key Features Implementation

### 1. Transport Registration Module
- **Auto-fetch student details** by enrollment number
- **Duplicate detection** with warning + edit option
- **SMS trigger** on registration/cancellation/change
- **Real-time sync** with Google Sheets

### 2. Attendance Sheet Generator
- **Input**: Bus Number, Start Date, End Date (15-30 days)
- **Output**: Printable PDF with:
  - Bus details (driver, conductor, route)
  - Student list with contact numbers
  - Date-wise AM/PM checkboxes
  - Summary section (present count, staff signature)

### 3. Bus Route Sheets
- **Auto-generate** route sheets per bus
- **Stop-wise student listing**
- **FN/AN shift separation**
- **Capacity utilization stats**
- **Teacher assignment display**

### 4. Special Events Route Sheets
- **Excel upload** for event-specific student lists
- **Bus-wise grouping**
- **Print-ready format** with all details

### 5. Student Transport Annexures
- Generate lists for:
  - FN Shift Transport Users
  - AN Shift Transport Users
  - Non-Transport Students (Private/Metro)

### 6. Admin Management Panel
- **CRUD operations** for:
  - Buses
  - Routes
  - Drivers & Conductors
  - Teachers
- **Real-time synchronization** with Google Sheets

### 7. Search Engine
- Multi-criteria search:
  - Name (fuzzy matching)
  - Enrollment Number
  - Bus Number
  - Route Number
- Display full transport profile or status

### 8. Dashboard
- **Live statistics**:
  - Bus-wise capacity vs usage
  - FN/AN breakdown
  - Teacher assignments
  - Student lists per bus

## Security Considerations
- Google OAuth 2.0 authentication
- Role-based access control (Admin, Staff, View-only)
- API key protection (environment variables)
- Rate limiting on API endpoints
- Input validation and sanitization
- HTTPS only in production

## API Endpoints Structure

```
/api/auth
  - GET  /login
  - GET  /callback
  - POST /logout

/api/students
  - GET    /[enrollmentNo]
  - GET    /list
  - POST   /register-transport
  - PUT    /update-transport
  - DELETE /cancel-transport

/api/buses
  - GET    /
  - GET    /[busNumber]
  - POST   /
  - PUT    /[busNumber]
  - DELETE /[busNumber]

/api/routes
  - GET    /
  - GET    /[routeNumber]
  - POST   /
  - PUT    /[routeNumber]
  - DELETE /[routeNumber]

/api/reports
  - POST /attendance-sheet
  - POST /route-sheet
  - POST /event-route-sheet
  - GET  /annexure/[type]

/api/search
  - GET  /?query=xxx&type=xxx

/api/dashboard
  - GET  /stats
  - GET  /bus-summary
```

## File Structure
```
sis-transport-system/
├── public/
│   ├── logo.png
│   └── fonts/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── dashboard/
│   │   ├── registration/
│   │   ├── attendance/
│   │   ├── routes/
│   │   ├── search/
│   │   ├── admin/
│   │   └── api/
│   ├── components/
│   │   ├── ui/
│   │   ├── forms/
│   │   ├── reports/
│   │   └── layout/
│   ├── lib/
│   │   ├── googleSheets.ts
│   │   ├── pdfGenerator.ts
│   │   ├── smsTemplates.ts
│   │   └── utils.ts
│   ├── context/
│   │   └── AppContext.tsx
│   └── types/
│       └── index.ts
├── google-apps-script/
│   ├── Code.gs
│   ├── Students.gs
│   ├── Transport.gs
│   ├── Reports.gs
│   └── appsscript.json
├── .env.local
├── next.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

## Deployment Strategy
1. **Google Apps Script**: Deploy as web app with public access
2. **Next.js Application**: Deploy to Vercel
3. **Environment Setup**: Configure OAuth credentials
4. **Database Setup**: Share Google Sheets with service account

## Performance Optimization
- Server-side rendering for initial load
- Client-side caching of frequently accessed data
- Lazy loading for reports and heavy components
- Optimized PDF generation (web workers)
- Debounced search queries
- Pagination for large lists

## Monitoring & Logging
- Error tracking (Sentry integration ready)
- API request logging
- User activity tracking
- Performance metrics
- Google Sheets API quota monitoring
