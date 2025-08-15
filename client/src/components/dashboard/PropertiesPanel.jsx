import React from 'react';

export default function PropertiesPanel({ component, updateComponent }) {
  if (!component) return <p>Select a component</p>;

  const onStyleChange = (e) => {
    const { name, value } = e.target;
    updateComponent(component.id, {
      style: {
        ...component.style,
        [name]: name === 'zIndex' ? parseInt(value) : value,
      },
    });
  };

  const onContentChange = (e) => {
    updateComponent(component.id, { content: e.target.value });
  };

  const onHrefChange = (e) => {
    updateComponent(component.id, { href: e.target.value });
  };

  const onClickChange = (e) => {
    updateComponent(component.id, { onClick: e.target.value });
  };

  return (
    <div >
      <h2>Properties</h2>

      {/* Inner Text */}
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Text</label>
        <input
          className="w-full border px-2 py-1"
          value={component.content}
          onChange={onContentChange}
        />
      </div>

      {/* Optional href for anchor */}
      {component.type === 'link' && (
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Href</label>
          <input
            className="w-full border px-2 py-1"
            value={component.href || ''}
            onChange={onHrefChange}
          />
        </div>
      )}

      {/* Optional click event */}
      {component.type === 'button' && (
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Click Handler (JS)</label>
          <textarea
            className="w-full border px-2 py-1"
            value={component.onClick || ''}
            onChange={onClickChange}
          />
        </div>
      )}

      {/* Style Properties */}
      {Object.entries(component.style).map(([key, value]) => (
        <div key={key} className="mb-2">
          <label className="block text-sm font-medium mb-1">{key}</label>
          <input
            className="w-full border px-2 py-1"
            name={key}
            value={value}
            onChange={onStyleChange}
          />
        </div>
      ))}
    </div>
  );
}
