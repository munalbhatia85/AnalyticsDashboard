// components/DashboardEditor.jsx
import React, { useState } from 'react';
import ComponentPalette from './ComponentPalette';
import Canvas from './Canvas';
import PropertiesPanel from './PropertiesPanel';

export default function DashboardEditor({ dashboardId }) {
  const [components, setComponents] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const updateComponent = (id, newProps) => {
    setComponents(prev => prev.map(c => (c.id === id ? { ...c, ...newProps } : c)));
  };

  return (
    <div className="grid grid-cols-12 gap-4" style={{height:"70%",minHeight:"70%",maxHeight:"70%"}}>
      <div className="col-span-2 bg-white p-2 border rounded" style={{height:"100%",minHeight:"100%",maxHeight:"100%"}}>
        <ComponentPalette setComponents={setComponents} />
      </div>
      <div className="col-span-7 bg-gray-50 p-2 border rounded " style={{height:"100%",minHeight:"100%",maxHeight:"100%"}}>
        <Canvas components={components} setSelectedId={setSelectedId} setComponents={setComponents} selectedId={selectedId} />
      </div>
      <div className="col-span-3 bg-white p-2 border rounded  overflow-y-auto" style={{height:"100%",minHeight:"100%",maxHeight:"100%"}}>
        <PropertiesPanel
          component={components.find(c => c.id === selectedId)}
          updateComponent={updateComponent}
        />
      </div>
    </div>
  );
}
