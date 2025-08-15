// components/ComponentPalette.jsx
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

const availableComponents = [
  { type: 'header', label: 'Header' },
  { type: 'footer', label: 'Footer' },
  { type: 'sidebar', label: 'Sidebar' },
  { type: 'button', label: 'Button' },
  { type: 'link', label: 'Anchor Link' }
];

export default function ComponentPalette({ setComponents }) {
  const addComponent = (type) => {
    const id = uuidv4();
    setComponents(prev => [...prev, {
      id,
      type,
      content: type.toUpperCase(),
      href: '', 
      onClick: '', 
      style: {   
        top: 50,
        left: 50,
        width: 150,
        height: 50,
        zIndex: 1,
        backgroundColor: '#ffffff',
        color: '#000000',
        border: '1px solid #000000',
        borderRadius: '4px',
     }
    }]);
  };

  return (
    <div>
      <h2 className="font-bold mb-2">Components</h2>
      {availableComponents.map(comp => (
        <button key={comp.type} className="block w-full p-2 mb-2 bg-blue-100" onClick={() => addComponent(comp.type)}>
          {comp.label}
        </button>
      ))}
    </div>
  );
}