# 🚌 SIS Transport Management System

A comprehensive, full-stack web application for managing school transport operations at **Shantiniketan Indian School Qatar** using Google Sheets as the backend database.

## ✨ Features

### Core Functionalities

1. **Transport Registration & Management**
   - Auto-fetch student details by enrollment number
   - Register students for transport
   - Update existing registrations
   - Cancel transport services
   - Duplicate detection with edit options
   - Automated SMS notifications

2. **Attendance Sheet Generator**
   - Generate printable bus-wise attendance sheets
   - Customizable date ranges (15-30 days)
   - AM/PM tracking columns
   - Professional PDF export
   - Includes bus and staff details

3. **Bus Route Sheets**
   - Auto-generate route sheets per bus
   - Stop-wise student listings
   - FN/AN shift separation
   - Capacity utilization statistics
   - Teacher assignment display
   - Print-ready format

4. **Event Transport Management**
   - Excel upload for event-specific students
   - Bus-wise grouping
   - Special event route sheets
   - Annual Day, Exams, Field Trips support

5. **Student Transport Annexures**
   - FN Shift Transport Users
   - AN Shift Transport Users
   - FN/AN All Students
   - Non-Transport Students Lists

6. **System Administration**
   - CRUD operations for Buses
   - CRUD operations for Routes
   - Driver & Conductor management
   - Teacher assignment
   - Real-time synchronization

7. **Advanced Search Engine**
   - Search by Name (fuzzy matching)
   - Search by Enrollment Number
   - Search by Bus Number
   - Search by Route Number
   - Comprehensive result display

8. **Live Dashboard**
   - Bus-wise capacity statistics
   - FN/AN shift breakdown
   - Utilization percentages
   - Teacher assignments
   - Real-time updates

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library
- **Icons**: Lucide React
- **PDF Generation**: jsPDF + jsPDF-AutoTable
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns

### Backend
- **Primary**: Google Apps Script
- **API Layer**: Next.js API Routes
- **Database**: Google Sheets
- **Authentication**: Google OAuth 2.0 (optional)

### Deployment
- **Platform**: Vercel
- **CI/CD**: Automatic deployments via Git

## 📁 Project Structure

```
sis-transport-system/
├── public/                          # Static assets
│   ├── logo.png
│   └── fonts/
├── src/
│   ├── app/                         # Next.js 14 App Router
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Homepage
│   │   ├── globals.css              # Global styles
│   │   ├── dashboard/               # Dashboard page
│   │   ├── registration/            # Transport registration
│   │   ├── attendance/              # Attendance sheets
│   │   ├── route-sheets/            # Route sheets
│   │   ├── search/                  # Search functionality
│   │   ├── reports/                 # Reports & annexures
│   │   ├── admin/                   # Admin panel
│   │   └── api/                     # API routes
│   │       ├── auth/
│   │       ├── students/
│   │       ├── buses/
│   │       ├── routes/
│   │       ├── reports/
│   │       ├── search/
│   │       └── dashboard/
│   ├── components/                  # React components
│   │   ├── ui/                      # UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── ...
│   │   ├── forms/                   # Form components
│   │   │   ├── TransportRegistrationForm.tsx
│   │   │   ├── BusForm.tsx
│   │   │   ├── RouteForm.tsx
│   │   │   └── ...
│   │   ├── reports/                 # Report components
│   │   │   ├── AttendanceSheet.tsx
│   │   │   ├── RouteSheet.tsx
│   │   │   └── ...
│   │   └── layout/                  # Layout components
│   │       ├── Navbar.tsx
│   │       ├── Footer.tsx
│   │       └── Sidebar.tsx
│   ├── lib/                         # Utility libraries
│   │   ├── googleSheets.ts          # Google Sheets integration
│   │   ├── pdfGenerator.ts          # PDF generation utilities
│   │   ├── smsTemplates.ts          # SMS template functions
│   │   └── utils.ts                 # Helper functions
│   ├── context/                     # React Context
│   │   └── AppContext.tsx           # Global state management
│   └── types/                       # TypeScript types
│       └── index.ts                 # Type definitions
├── google-apps-script/              # Backend scripts
│   ├── Code.gs                      # Main entry point
│   ├── Students.gs                  # Student operations
│   ├── Transport.gs                 # Transport operations
│   ├── Buses.gs                     # Bus operations
│   ├── Routes.gs                    # Route operations
│   ├── Teachers.gs                  # Teacher operations
│   ├── Reports.gs                   # Report generation
│   └── appsscript.json              # Apps Script config
├── .env.local                       # Environment variables (gitignored)
├── .gitignore                       # Git ignore rules
├── next.config.js                   # Next.js configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
├── package.json                     # Dependencies
├── README.md                        # This file
├── DEPLOYMENT.md                    # Deployment guide
└── ARCHITECTURE.md                  # System architecture
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Google Account with Sheets access
- Vercel account (for deployment)

### 1. Clone the Repository

```bash
git clone [repository-url]
cd sis-transport-system
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables

Create a `.env.local` file:

```env
GOOGLE_SHEET_ID=your_spreadsheet_id
GOOGLE_CLIENT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY="your_private_key"
NEXT_PUBLIC_APPS_SCRIPT_URL=your_apps_script_url
NEXT_PUBLIC_APP_NAME="SIS Transport Management"
NEXT_PUBLIC_SCHOOL_NAME="Shantiniketan Indian School Qatar"
```

### 4. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📖 Detailed Documentation

- **[Deployment Guide](./DEPLOYMENT.md)** - Complete setup and deployment instructions
- **[Architecture](./ARCHITECTURE.md)** - System design and technical details

## 🗄️ Database Schema

### Students Sheet
| Column | Type | Description |
|--------|------|-------------|
| Enrollment No | String | Unique student identifier |
| Name | String | Student full name |
| Class | String | Class level |
| Division | String | Section/Division |
| Shift | FN/AN | Forenoon or Afternoon |
| Contact No 1 | String | Primary contact |
| Contact No 2 | String | Secondary contact |
| Address | String | Home address |
| Parent Name | String | Parent/Guardian name |

### Transport Registrations Sheet
| Column | Type | Description |
|--------|------|-------------|
| Enrollment No | String | Student identifier |
| Bus Number | String | Assigned bus |
| Route Number | String | Assigned route |
| Stop Name | String | Pickup/Drop point |
| Registration Date | DateTime | Registration timestamp |
| Status | Active/Cancelled | Current status |
| Cancellation Date | DateTime | If cancelled |
| Last Updated | DateTime | Last modification |

### Buses Sheet
| Column | Type | Description |
|--------|------|-------------|
| Bus Number | String | Unique bus identifier |
| Capacity | Number | Total seats |
| Route Number | String | Assigned route |
| Driver Name | String | Driver full name |
| Driver Contact | String | Driver phone |
| Conductor Name | String | Conductor name |
| Conductor Contact | String | Conductor phone |
| Teacher Assigned | String | Supervising teacher |
| Shift | FN/AN | Operating shift |

## 📋 API Endpoints

### Students
- `GET /api/students/:enrollmentNo` - Get student details
- `GET /api/students/list` - Get all students
- `POST /api/students/register-transport` - Register for transport
- `PUT /api/students/update-transport` - Update registration
- `DELETE /api/students/cancel-transport` - Cancel transport

### Buses
- `GET /api/buses` - Get all buses
- `GET /api/buses/:busNumber` - Get bus details
- `POST /api/buses` - Create new bus
- `PUT /api/buses/:busNumber` - Update bus
- `DELETE /api/buses/:busNumber` - Delete bus

### Routes
- `GET /api/routes` - Get all routes
- `GET /api/routes/:routeNumber` - Get route details
- `POST /api/routes` - Create new route
- `PUT /api/routes/:routeNumber` - Update route
- `DELETE /api/routes/:routeNumber` - Delete route

### Reports
- `POST /api/reports/attendance-sheet` - Generate attendance sheet
- `POST /api/reports/route-sheet` - Generate route sheet
- `POST /api/reports/event-route-sheet` - Generate event sheet
- `GET /api/reports/annexure/:type` - Generate annexure

### Search
- `GET /api/search?query=xxx&type=xxx` - Search records

### Dashboard
- `GET /api/dashboard/stats` - Get statistics
- `GET /api/dashboard/bus-summary` - Get bus summary

## 🎨 UI Components

### Reusable Components
- `<Button>` - Customizable button component
- `<Input>` - Form input with validation
- `<Select>` - Dropdown select component
- `<Modal>` - Modal dialog
- `<Card>` - Content card
- `<Table>` - Data table
- `<Badge>` - Status badge
- `<Alert>` - Alert messages
- `<Spinner>` - Loading indicator

## 📱 SMS Integration

The system includes SMS template generation for:
- New registrations
- Cancellations
- Route changes
- Stop changes
- Emergency notifications
- Delay alerts

To enable SMS sending, integrate with your SMS provider in `google-apps-script/Code.gs`.

## 🔒 Security Features

- Google OAuth 2.0 authentication
- Role-based access control
- API rate limiting
- Input validation & sanitization
- HTTPS enforcement
- Environment variable encryption
- Secure service account credentials

## 🧪 Testing

Run tests:
```bash
npm test
# or
yarn test
```

Run type checking:
```bash
npm run type-check
# or
yarn type-check
```

## 📦 Building for Production

```bash
npm run build
# or
yarn build
```

Start production server:
```bash
npm start
# or
yarn start
```

## 🌐 Deployment

Deploy to Vercel:
```bash
vercel
```

Or push to your Git repository and connect to Vercel dashboard.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software of Shantiniketan Indian School Qatar.

## 👥 Authors

- **Finance Department** - *System Design & Requirements*
- **IT Team** - *Development & Implementation*

## 🙏 Acknowledgments

- Shantiniketan Indian School Qatar Management
- Transport Department Staff
- All contributors and testers

## 📞 Support

For technical support or questions:
- Email: it@sisqatar.com
- Phone: +974 XXXX XXXX
- Website: www.sisqatar.com

## 🔄 Version History

- **v1.0.0** (Current) - Initial release with all core features

---

**Made with ❤️ for Shantiniketan Indian School Qatar**
