import { NextResponse } from 'next/server';

// Demo data - Replace with actual Google Sheets integration
const getDemoStats = () => ({
  totalBuses: 12,
  totalRoutes: 10,
  totalTransportUsers: 450,
  fnTransportUsers: 280,
  anTransportUsers: 170,
  totalStudents: 1200,
  averageOccupancy: 75,
});

export async function GET() {
  try {
    // In production, fetch from Google Sheets via Apps Script
    const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;
    
    if (APPS_SCRIPT_URL) {
      try {
        const response = await fetch(`${APPS_SCRIPT_URL}?action=getDashboardStats`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (response.ok) {
          const data = await response.json();
          return NextResponse.json({ success: true, data });
        }
      } catch (error) {
        console.error('Apps Script fetch error:', error);
      }
    }
    
    // Return demo data if Apps Script not configured
    return NextResponse.json({
      success: true,
      data: getDemoStats(),
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
