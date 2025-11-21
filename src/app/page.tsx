'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;

  useEffect(() => {
    async function fetchStats() {
      try {
        if (!APPS_SCRIPT_URL) {
          throw new Error('Apps Script URL not configured. Please check environment variables.');
        }

        console.log('Fetching from:', APPS_SCRIPT_URL);

        const response = await fetch(`${APPS_SCRIPT_URL}?action=getStats`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Stats received:', data);
        setStats(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching stats:', err);
        setError(err.message || 'Failed to load statistics');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [APPS_SCRIPT_URL]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 p-2 rounded-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">SIS Transport</h1>
                <p className="text-sm text-gray-500">Management System</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-4xl font-bold mb-4">Welcome to SIS Transport Management System</h2>
          <p className="text-xl text-blue-100">
            Comprehensive solution for managing school transport operations at Shantiniketan Indian School Qatar
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Overview */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Overview</h3>
          
          {loading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-blue-700">Loading statistics from Google Sheets...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-700 font-semibold">Error: {error}</p>
              <p className="text-sm text-red-600 mt-2">Please check your configuration and try refreshing the page.</p>
              {!APPS_SCRIPT_URL && (
                <div className="mt-4 p-4 bg-red-100 rounded">
                  <p className="text-sm text-red-800 font-mono">
                    <strong>Missing Configuration:</strong> NEXT_PUBLIC_APPS_SCRIPT_URL is not set.
                  </p>
                </div>
              )}
            </div>
          )}

          {stats && !loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-500">Total Students</div>
                <div className="mt-2 text-3xl font-bold text-gray-900">{stats.totalStudents || 0}</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-500">Using Transport</div>
                <div className="mt-2 text-3xl font-bold text-blue-600">{stats.transportUsers || 0}</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-500">Total Buses</div>
                <div className="mt-2 text-3xl font-bold text-green-600">{stats.totalBuses || 0}</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-500">Active Routes</div>
                <div className="mt-2 text-3xl font-bold text-purple-600">{stats.totalRoutes || 0}</div>
              </div>
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Transport Registration</h4>
                  <p className="mt-1 text-sm text-gray-500">Register new students or update existing registrations</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Attendance Sheets</h4>
                  <p className="mt-1 text-sm text-gray-500">Generate bus-wise attendance sheets for tracking</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Reports & Annexures</h4>
                  <p className="mt-1 text-sm text-gray-500">Generate various reports and student lists</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
```

5. **Commit message:** "Fix: Call Apps Script directly instead of local API"

6. **Click "Commit changes"**

7. **Wait 2-3 minutes** for Vercel to deploy

8. **Hard refresh your website** (Ctrl+Shift+R)

---

## 🎯 **THIS CODE WILL:**

✅ Call Apps Script directly with the URL from environment variables  
✅ Show detailed error messages  
✅ Log to console for debugging  
✅ Display loading spinner  
✅ Show stats cards when data loads  

---

## 📊 **After You Commit:**

You should see in the console:
```
Fetching from: https://script.google.com/macros/s/AKfyc...
Stats received: {totalStudents: X, totalBuses: Y, ...}
