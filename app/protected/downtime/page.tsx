// app/maintenance/page.js

import React from 'react';

export const metadata = {
  title: 'Page Under Maintenance',
};

export default function MaintenancePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 text-gray-800">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-red-600">🚧 Under Maintenance 🚧</h1>
        <p className="text-lg text-gray-600">
          This page is currently under maintenance. We're working hard to bring it back as soon as possible.
        </p>
        <p className="text-gray-500">Thank you for your patience!</p>
        <div className="mt-4">
          <a
            href="/"
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"
          >
            Go Back to Homepage
          </a>
        </div>
      </div>
    </div>
  );
}
