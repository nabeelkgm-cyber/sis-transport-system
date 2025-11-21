'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Bus, 
  Route, 
  Users, 
  FileText, 
  Search, 
  Settings,
  TrendingUp,
  Calendar,
  CheckSquare
} from 'lucide-react';

interface DashboardStats {
  totalBuses: number;
  totalRoutes: number;
  totalTransportUsers: number;
  fnTransportUsers: number;
  anTransportUsers: number;
  averageOccupancy: number;
}

export default function HomePage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Transport Registration',
      description: 'Register new students or update existing registrations',
      href: '/registration',
      icon: Bus,
      color: 'primary',
    },
    {
      title: 'Attendance Sheets',
      description: 'Generate bus-wise attendance sheets for tracking',
      href: '/attendance',
      icon: CheckSquare,
      color: 'success',
    },
    {
      title: 'Route Sheets',
      description: 'View and print bus route sheets with student lists',
      href: '/route-sheets',
      icon: Route,
      color: 'warning',
    },
    {
      title: 'Search Records',
      description: 'Search students, buses, and routes quickly',
      href: '/search',
      icon: Search,
      color: 'secondary',
    },
    {
      title: 'Reports & Annexures',
      description: 'Generate various reports and student lists',
      href: '/reports',
      icon: FileText,
      color: 'primary',
    },
    {
      title: 'System Administration',
      description: 'Manage buses, routes, drivers, and teachers',
      href: '/admin',
      icon: Settings,
      color: 'gray',
    },
  ];

  const StatCard = ({ 
    label, 
    value, 
    icon: Icon, 
    trend 
  }: { 
    label: string; 
    value: string | number; 
    icon: any; 
    trend?: { value: number; positive: boolean } 
  }) => (
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="stat-label">{label}</p>
          <p className="stat-value">{value}</p>
          {trend && (
            <p className={trend.positive ? 'stat-change-positive' : 'stat-change-negative'}>
              {trend.positive ? '+' : ''}{trend.value}% from last month
            </p>
          )}
        </div>
        <div className="p-3 bg-primary-100 rounded-lg">
          <Icon className="w-8 h-8 text-primary-600" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">
          Welcome to SIS Transport Management System
        </h1>
        <p className="text-primary-100 text-lg">
          Comprehensive solution for managing school transport operations at
          Shantiniketan Indian School Qatar
        </p>
      </div>

      {/* Statistics */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Quick Overview</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card">
                <div className="skeleton h-24 w-full rounded"></div>
              </div>
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Buses"
              value={stats.totalBuses}
              icon={Bus}
            />
            <StatCard
              label="Active Routes"
              value={stats.totalRoutes}
              icon={Route}
            />
            <StatCard
              label="Transport Users"
              value={stats.totalTransportUsers}
              icon={Users}
            />
            <StatCard
              label="Average Occupancy"
              value={`${stats.averageOccupancy}%`}
              icon={TrendingUp}
            />
          </div>
        ) : (
          <div className="alert-danger">
            Failed to load statistics. Please try refreshing the page.
          </div>
        )}
      </div>

      {/* Shift Breakdown */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card">
            <h3 className="card-title">Forenoon Shift (FN)</h3>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Transport Users</span>
                <span className="font-bold text-2xl text-primary-600">
                  {stats.fnTransportUsers}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-primary-600 h-3 rounded-full transition-all"
                  style={{
                    width: `${(stats.fnTransportUsers / stats.totalTransportUsers) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title">Afternoon Shift (AN)</h3>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Transport Users</span>
                <span className="font-bold text-2xl text-secondary-600">
                  {stats.anTransportUsers}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-secondary-600 h-3 rounded-full transition-all"
                  style={{
                    width: `${(stats.anTransportUsers / stats.totalTransportUsers) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="card hover:shadow-medium transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 bg-${action.color}-100 rounded-lg group-hover:scale-110 transition-transform`}>
                  <action.icon className={`w-6 h-6 text-${action.color}-600`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity (placeholder for future implementation) */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Activity</h2>
          <Link href="/dashboard" className="text-primary-600 text-sm hover:underline">
            View All
          </Link>
        </div>
        <div className="empty-state">
          <Calendar className="empty-state-icon" />
          <h3 className="empty-state-title">No Recent Activity</h3>
          <p className="empty-state-description">
            Recent transport registrations and updates will appear here
          </p>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <h3 className="text-lg font-semibold mb-2 text-gray-900">
          Need Help?
        </h3>
        <p className="text-gray-600 mb-4">
          Access our documentation and support resources to make the most of the system.
        </p>
        <div className="flex gap-4">
          <button className="btn-outline">
            View Documentation
          </button>
          <button className="btn-secondary">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
