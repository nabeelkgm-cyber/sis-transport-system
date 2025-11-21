'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* School Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Shantiniketan Indian School
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>Doha, Qatar</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+974 XXXX XXXX</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>transport@sisqatar.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <Link href="/" className="block hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/registration" className="block hover:text-white transition-colors">
                Transport Registration
              </Link>
              <Link href="/search" className="block hover:text-white transition-colors">
                Search Records
              </Link>
              <Link href="/reports" className="block hover:text-white transition-colors">
                Reports
              </Link>
            </div>
          </div>

          {/* System Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">System Information</h3>
            <div className="space-y-2 text-sm">
              <p>Version 1.0.0</p>
              <p>Last Updated: {new Date().toLocaleDateString()}</p>
              <p className="text-xs text-gray-400 mt-4">
                For technical support, please contact the IT department.
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
          <p className="flex items-center justify-center gap-1">
            © {currentYear} Shantiniketan Indian School Qatar. Built with
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            by SIS IT Team
          </p>
        </div>
      </div>
    </footer>
  );
}
