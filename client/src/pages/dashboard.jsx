import React from 'react';
import DashboardManager from './../components/dashboard/DashboardManager';

function DashboardBuilder() {
  return (
    <div className="min-h-[80vh] max-h-[80vh] bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Multi-Dashboard Builder</h1>
      <DashboardManager />
    </div>
  );
}

export default DashboardBuilder;