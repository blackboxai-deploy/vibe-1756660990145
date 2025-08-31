import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lost & Found System',
  description: 'A comprehensive platform for reporting and finding lost items. Connect lost and found items with intelligent matching algorithms.',
  keywords: 'lost and found, lost items, found items, item recovery, lost property',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>{children}</main>
          <footer className="bg-white border-t border-gray-200 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">L&amp;F</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Lost &amp; Found</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Helping people reunite with their lost belongings through our intelligent matching system.
                    Report lost items, browse found items, and get connected with the community.
                  </p>
                  <p className="text-sm text-gray-500">
                    © 2024 Lost &amp; Found System. All rights reserved.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li><a href="/lost" className="hover:text-gray-900">Browse Lost Items</a></li>
                    <li><a href="/found" className="hover:text-gray-900">Browse Found Items</a></li>
                    <li><a href="/lost/report" className="hover:text-gray-900">Report Lost Item</a></li>
                    <li><a href="/found/report" className="hover:text-gray-900">Report Found Item</a></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li><a href="/help" className="hover:text-gray-900">Help Center</a></li>
                    <li><a href="/contact" className="hover:text-gray-900">Contact Us</a></li>
                    <li><a href="/privacy" className="hover:text-gray-900">Privacy Policy</a></li>
                    <li><a href="/terms" className="hover:text-gray-900">Terms of Service</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}