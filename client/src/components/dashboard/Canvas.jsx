import React from 'react';
import { Rnd } from 'react-rnd';
import { componentsMap } from './componentsMap';

export default function Canvas({ components, setSelectedId, setComponents, selectedId }) {
  const updateComponent = (id, style) => {
    setComponents(prev =>
      prev.map(c => (c.id === id ? { ...c, style: { ...c.style, ...style } } : c))
    );
  };

  return (
    <div className="relative w-full h-full  overflow-auto">
      {components.map(comp => {
        const Comp = componentsMap[comp.type];
        return (
          <Rnd
            key={comp.id}
            bounds="parent" 
            size={{ width: comp.style.width, height: comp.style.height }}
            position={{ x: comp.style.left, y: comp.style.top }}
            style={{
              zIndex: comp.style.zIndex,
              border: selectedId === comp.id ? '2px solid blue' : '1px solid gray',
              backgroundColor: 'white'
            }}
            onClick={() => setSelectedId(comp.id)}
            onDragStop={(e, d) => updateComponent(comp.id, { top: d.y, left: d.x })}
            onResizeStop={(e, dir, ref, delta, pos) =>
              updateComponent(comp.id, {
                width: ref.offsetWidth,
                height: ref.offsetHeight,
                top: pos.y,
                left: pos.x
              })
            }
          >
           <Comp
            content={comp.content}
            style={comp.style}
            href={comp.href}
            onClick={comp.onClick}
            />
          </Rnd>
        );
      })}
    </div>
  );
}
