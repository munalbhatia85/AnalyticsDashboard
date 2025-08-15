import React, { useState } from 'react';
import DashboardEditor from './DashboardEditor';

const dashboards = [
  { id: 'dashboard1', name: 'Dashboard 1' },
  { id: 'dashboard2', name: 'Dashboard 2' }
];

export default function DashboardManager() {
  const [activeDashboard, setActiveDashboard] = useState(dashboards[0].id);

  return (
    <div style={{height: "80vh"}}>
      <div className="flex space-x-2 mb-4">
        {dashboards.map(d => (
          <button
            key={d.id}
            className={`px-4 py-2 rounded ${activeDashboard === d.id ? 'bg-blue-600 text-white' : 'bg-white border'}`}
            onClick={() => setActiveDashboard(d.id)}>
            {d.name}
          </button>
        ))}
      </div>
      <DashboardEditor dashboardId={activeDashboard} />
    </div>
  );
}