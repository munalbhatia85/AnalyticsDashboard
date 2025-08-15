import React, { useState } from 'react';
import { Tab, Tabs, Button, Container, Row, Col } from 'react-bootstrap';
import { Trash, Plus, Download, Grid, CardHeading, CardText, ListUl } from 'react-bootstrap-icons';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
// import ChartPreview from './ChartPreview';

// Component types with configuration
const COMPONENT_TYPES = {
  CHART: {
    type: 'chart',
    name: 'Chart',
    icon: <Grid size={18} />,
    defaultData: {
      dataset: null,
      chartType: 'Bar',
      xAxes: [],
      yAxes: [],
      title: 'New Chart'
    }
  },
  BUTTON: {
    type: 'button',
    name: 'Button',
    icon: <ListUl size={18} />,
    defaultData: {
      label: 'Click Me',
      variant: 'primary',
      size: 'md'
    }
  },
  HEADER: {
    type: 'header',
    name: 'Header',
    icon: <CardHeading size={18} />,
    defaultData: {
      text: 'Dashboard Header',
      variant: 'light'
    }
  },
  FOOTER: {
    type: 'footer',
    name: 'Footer',
    icon: <CardText size={18} />,
    defaultData: {
      text: 'Dashboard Footer © 2023',
      variant: 'dark'
    }
  }
};

// Draggable Sidebar Item
const SidebarItem = ({ typeConfig }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'SIDEBAR_ITEM',
    item: { type: typeConfig.type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div 
      ref={drag}
      className="sidebar-item d-flex align-items-center p-2 mb-2 border rounded"
      style={{ 
        opacity: isDragging ? 0.5 : 1, 
        cursor: 'move',
        backgroundColor: isDragging ? '#f8f9fa' : 'white'
      }}
    >
      {typeConfig.icon}
      <span className="ms-2">{typeConfig.name}</span>
    </div>
  );
};

// Dashboard Component with Drag and Drop
const DashboardComponent = ({ 
  id, 
  type, 
  data, 
  onEdit, 
  onDelete,
  index,
  moveComponent
}) => {
  const ref = React.useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'COMPONENT',
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'COMPONENT',
    hover(item, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveComponent(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  const renderComponent = () => {
    switch (type) {
      case COMPONENT_TYPES.CHART.type:
        //return <ChartPreview {...data} />;
      case COMPONENT_TYPES.BUTTON.type:
        return <Button variant={data.variant} size={data.size}>{data.label}</Button>;
      case COMPONENT_TYPES.HEADER.type:
        return <div className={`dashboard-header p-3 bg-${data.variant}`}>{data.text}</div>;
      case COMPONENT_TYPES.FOOTER.type:
        return <div className={`dashboard-footer p-3 bg-${data.variant} text-white`}>{data.text}</div>;
      default:
        return null;
    }
  };

  return (
    <div
      ref={ref}
      style={{ 
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : 'move'
      }}
      className="dashboard-component position-relative border p-2 mb-3 bg-white"
    >
      <div className="component-actions position-absolute top-0 end-0 bg-white p-1 rounded">
        <Button 
          variant="link" 
          size="sm" 
          onClick={() => onEdit(id)} 
          className="text-dark"
        >
          Edit
        </Button>
        <Button 
          variant="link" 
          size="sm" 
          onClick={() => onDelete(id)} 
          className="text-danger"
        >
          <Trash size={14} />
        </Button>
      </div>
      {renderComponent()}
    </div>
  );
};

// Dashboard Tab Content (Drop Target)
const DashboardTabContent = ({ 
  components, 
  onDrop, 
  onEdit, 
  onDelete,
  moveComponent
}) => {
  const [, drop] = useDrop(() => ({
    accept: ['SIDEBAR_ITEM'],
    drop: (item) => onDrop(item.type),
  }));

  return (
    <div ref={drop} className="dashboard-content p-3" style={{ minHeight: '500px' }}>
      {components.map((comp, index) => (
        <DashboardComponent
          key={comp.id}
          {...comp}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
          moveComponent={moveComponent}
        />
      ))}
      {components.length === 0 && (
        <div className="empty-dashboard text-center p-5 text-muted border rounded">
          <p>Drag components here to build your dashboard</p>
          <small className="text-muted">Start by dragging items from the left sidebar</small>
        </div>
      )}
    </div>
  );
};

// Main Dashboard Builder Component
const DashboardBuilder = () => {
  const [activeTab, setActiveTab] = useState('dashboard-1');
  const [dashboards, setDashboards] = useState({
    'dashboard-1': {
      name: 'Dashboard 1',
      components: []
    }
  });
  const [nextId, setNextId] = useState(1);

  // Add new dashboard
  const addDashboard = () => {
    const newId = `dashboard-${Object.keys(dashboards).length + 1}`;
    setDashboards({
      ...dashboards,
      [newId]: {
        name: `Dashboard ${Object.keys(dashboards).length + 1}`,
        components: []
      }
    });
    setActiveTab(newId);
  };

  // Remove dashboard
  const removeDashboard = (id) => {
    if (Object.keys(dashboards).length <= 1) return;
    
    const newDashboards = { ...dashboards };
    delete newDashboards[id];
    setDashboards(newDashboards);
    setActiveTab(Object.keys(newDashboards)[0]);
  };

  // Add component to dashboard
  const addComponent = (type) => {
    const typeConfig = Object.values(COMPONENT_TYPES).find(t => t.type === type);
    if (!typeConfig) return;

    const newId = nextId;
    setNextId(newId + 1);

    setDashboards({
      ...dashboards,
      [activeTab]: {
        ...dashboards[activeTab],
        components: [
          ...dashboards[activeTab].components,
          {
            id: newId,
            type,
            data: { ...typeConfig.defaultData }
          }
        ]
      }
    });
  };

  // Move component
  const moveComponent = (fromIndex, toIndex) => {
    const newComponents = [...dashboards[activeTab].components];
    const [movedItem] = newComponents.splice(fromIndex, 1);
    newComponents.splice(toIndex, 0, movedItem);
    
    setDashboards({
      ...dashboards,
      [activeTab]: {
        ...dashboards[activeTab],
        components: newComponents
      }
    });
  };

  // Edit component
  const editComponent = (id) => {
    // Implement your edit logic here
    console.log('Editing component:', id);
  };

  // Delete component
  const deleteComponent = (id) => {
    setDashboards({
      ...dashboards,
      [activeTab]: {
        ...dashboards[activeTab],
        components: dashboards[activeTab].components.filter(comp => comp.id !== id)
      }
    });
  };

  // Export dashboard
  const exportDashboard = () => {
    const dashboard = dashboards[activeTab];
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${dashboard.name}</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
      </head>
      <body>
        <div class="container mt-3">
          ${dashboard.components.map(comp => {
            switch (comp.type) {
              case COMPONENT_TYPES.CHART.type:
                return `<div class="chart-container"><h4>${comp.data.title}</h4></div>`;
              case COMPONENT_TYPES.BUTTON.type:
                return `<button class="btn btn-${comp.data.variant}">${comp.data.label}</button>`;
              case COMPONENT_TYPES.HEADER.type:
                return `<header class="p-3 bg-${comp.data.variant}">${comp.data.text}</header>`;
              case COMPONENT_TYPES.FOOTER.type:
                return `<footer class="p-3 bg-${comp.data.variant} text-white">${comp.data.text}</footer>`;
              default:
                return '';
            }
          }).join('')}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dashboard.name.replace(/\s+/g, '-').toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Container fluid className="dashboard-builder">
        <Row>
          {/* Sidebar */}
          <Col md={2} className="sidebar bg-light p-3">
            <h5>Components</h5>
            {Object.values(COMPONENT_TYPES).map((typeConfig) => (
              <SidebarItem 
                key={typeConfig.type}
                typeConfig={typeConfig}
              />
            ))}
          </Col>

          {/* Main Content */}
          <Col md={10} className="main-content p-0">
            <div className="toolbar bg-white p-2 border-bottom d-flex justify-content-between">
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-0"
              >
                {Object.entries(dashboards).map(([id, dashboard]) => (
                  <Tab 
                    key={id}
                    eventKey={id}
                    title={
                      <div className="d-flex align-items-center">
                        {dashboard.name}
                        <span 
                          className="ms-1 p-0 text-danger"
                          style={{ cursor: 'pointer' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeDashboard(id);
                          }}
                        >
                          <Trash size={12} />
                        </span>
                      </div>
                    }
                  />
                ))}
              </Tabs>
              <div>
                <Button variant="primary" size="sm" onClick={addDashboard} className="me-2">
                  <Plus size={14} /> Add Dashboard
                </Button>
                <Button variant="success" size="sm" onClick={exportDashboard}>
                  <Download size={14} /> Export
                </Button>
              </div>
            </div>

            {/* Dashboard Content */}
            {activeTab && dashboards[activeTab] && (
              <DashboardTabContent
                components={dashboards[activeTab].components}
                onDrop={addComponent}
                onEdit={editComponent}
                onDelete={deleteComponent}
                moveComponent={moveComponent}
              />
            )}
          </Col>
        </Row>
      </Container>
    </DndProvider>
  );
};

export default DashboardBuilder;