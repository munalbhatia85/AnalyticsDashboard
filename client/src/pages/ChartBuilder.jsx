/**
 * Chart Builder Main Page - Redesigned
 * 
 * Enhanced version with:
 * - Collapsible side panels
 * - Improved responsive layout
 * - Better visual hierarchy
 * - Persistent panel states
 */
import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Offcanvas } from 'react-bootstrap';
import { 
  ChevronDoubleLeft, 
  ChevronDoubleRight,
  Gear,
  ListUl 
} from 'react-bootstrap-icons';
import api from '../services/api';
import DatasetSelector from '../components/chart/DatasetSelector';
import ChartTypeSelector from '../components/chart/ChartTypeSelector';
import ChartProperties from '../components/chart/ChartProperties';
import ChartPreview from '../components/chart/ChartPreview';

export default function ChartBuilderPage() {
  // Data state
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [selectedChart, setSelectedChart] = useState('Line');
  const [xAxes, setXAxes] = useState([]);
  const [yAxes, setYAxes] = useState([]);
  const [title, setTitle] = useState('');
  const [validationError, setValidationError] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [mobileView, setMobileView] = useState(false);


  const [colors, setColors] = useState([
    '#4e79a7', // blue
    '#f28e2b', // orange
    '#e15759', // red
    '#76b7b2', // teal
    '#59a14f', // green
    '#edc948', // yellow
    '#b07aa1', // purple
    '#ff9da7', // pink
  ]);
  const handleColorChange = (index, newColor) => {
    const newColors = [...colors];
    newColors[index] = newColor;
    setColors(newColors);
  };
  // Check viewport on resize
  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth < 992);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/json');
        setDatasets(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDatasetSelect = (ds) => {
    setSelectedDataset(ds);
    setXAxes([]);
    setYAxes([]);
  };

  // Panel toggle handlers
  const toggleLeftPanel = () => setLeftPanelOpen(!leftPanelOpen);
  const toggleRightPanel = () => setRightPanelOpen(!rightPanelOpen);

return (
    <Container fluid className="chart-builder-container px-0">
      {/* Mobile Header with Toggle Buttons */}
      {mobileView && (
        <div className="d-flex justify-content-between align-items-center p-2 border-bottom">
          <Button 
            variant="outline-secondary"
            onClick={toggleLeftPanel}
            size="sm"
          >
            <ListUl size={18} className="me-1" />
            Datasets
          </Button>
          <Button 
            variant="outline-secondary"
            onClick={toggleRightPanel}
            size="sm"
          >
            <Gear size={18} className="me-1" />
            Settings
          </Button>
        </div>
      )}

      {/* Fixed Bottom Toggle Buttons for Desktop */}
      {!mobileView && (
        <div className="fixed-bottom-buttons">
          <Button 
            variant="light"
            className="panel-toggle left"
            onClick={toggleLeftPanel}
          >
            {leftPanelOpen ? <ChevronDoubleLeft /> : <ChevronDoubleRight />}
          </Button>
          <Button 
            variant="light"
            className="panel-toggle right"
            onClick={toggleRightPanel}
          >
            {rightPanelOpen ? <ChevronDoubleRight /> : <ChevronDoubleLeft />}
          </Button>
        </div>
      )}

      <Row className="g-0">
        {/* Left Panel - Dataset Selector (Desktop) */}
        {!mobileView && (
          <Col md={3} className={`left-panel bg-light ${leftPanelOpen ? '' : 'collapsed'}`}>
            <DatasetSelector 
              datasets={datasets}
              selectedDataset={selectedDataset}
              onSelect={handleDatasetSelect}
              loading={loading}
              error={error}
              // Pass the new props
              xAxes={xAxes}
              yAxes={yAxes}
              onXAxesChange={setXAxes}
              onYAxesChange={setYAxes}
              chartType={selectedChart}
            />
            <ChartTypeSelector
              selectedChart={selectedChart}
              onChange={setSelectedChart}
              disabled={!selectedDataset}
            />
          </Col>
        )}

  
        {/* Left Panel - Offcanvas (Mobile) */}
        {mobileView && (
          <Offcanvas
            show={leftPanelOpen}
            onHide={toggleLeftPanel}
            placement="start"
            className="left-panel-mobile"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Datasets</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <DatasetSelector 
                datasets={datasets}
                selectedDataset={selectedDataset}
                onSelect={handleDatasetSelect}
                loading={loading}
                error={error}
              />
              <ChartTypeSelector
                selectedChart={selectedChart}
                onChange={setSelectedChart}
                disabled={!selectedDataset}
              />
            </Offcanvas.Body>
          </Offcanvas>
        )}

        {/* Main Chart Area */}
        <Col 
          md={
            leftPanelOpen && rightPanelOpen ? 6 : 
            leftPanelOpen || rightPanelOpen ? 9 : 
            12
          }
          className="main-content"
        >
          <ChartPreview
            dataset={selectedDataset}
            chartType={selectedChart}
            xAxes={xAxes}
            yAxes={yAxes}
            title={title}
          />
        </Col>

        {/* Right Panel - Chart Properties (Desktop) */}
       {!mobileView && (
          <Col 
            md={3} 
            className={`right-panel bg-light ${rightPanelOpen ? '' : 'collapsed'}`}
          >
            <div className="panel-content">
              <ChartProperties
                dataset={selectedDataset}
                chartType={selectedChart}
                xAxes={xAxes}
                yAxes={yAxes}
                title={title}
                colors={colors}
                validationError={validationError}
                onXAxesChange={setXAxes}
                onYAxesChange={setYAxes}
                onTitleChange={setTitle}
                onColorChange={handleColorChange}
                onValidationError={setValidationError}
              />
            </div>
          </Col>
        )}

        {/* Right Panel - Offcanvas (Mobile) */}
        {mobileView && (
          <Offcanvas
            show={rightPanelOpen}
            onHide={toggleRightPanel}
            placement="end"
            className="right-panel-mobile"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Chart Settings</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <ChartProperties
                dataset={selectedDataset}
                chartType={selectedChart}
                xAxes={xAxes}
                yAxes={yAxes}
                title={title}
                validationError={validationError}
                onXAxesChange={setXAxes}
                onYAxesChange={setYAxes}
                onTitleChange={setTitle}
                onValidationError={setValidationError}
              />
            </Offcanvas.Body>
          </Offcanvas>
        )}
      </Row>

      {/* Global Styles */}
      <style>{`
        .chart-builder-container {
          height: 90vh;
          overflow: hidden;
          position: relative;
        }
        
        /* Fixed Bottom Buttons */
        .fixed-bottom-buttons {
          position: fixed;
          bottom: 20px;
          width: 100%;
          display: flex;
          justify-content: space-between;
          z-index: 1000;
        }

        .panel-toggle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          background: white;
          border: 1px solid #dee2e6;
          transition: transform 0.3s ease;
        }

        .panel-toggle.left {
          margin-left: 20px;
          transform: translateX(${leftPanelOpen ? 'calc(25% - 20px)' : '0'});
        }

        .panel-toggle.right {
          margin-right: 20px;
          transform: translateX(${rightPanelOpen ? 'calc(-25% + 20px)' : '0'});
        }

        /* Desktop Panels */
        .left-panel, .right-panel {
          height: 90vh;
          position: relative;
          transition: all 0.3s ease;
          overflow-y: auto;
          border-right: 1px solid #dee2e6;
          padding: 1%;
        }
        
        .right-panel {
          border-right: none;
          border-left: 1px solid #dee2e6;
        }
        
        .left-panel.collapsed {
          transform: translateX(-100%);
          position: absolute;
          z-index: 1000;
        }
        
        .right-panel.collapsed {
          transform: translateX(100%);
          position: absolute;
          right: 0;
          z-index: 1000;
        }
        
        /* Main Content */
        .main-content {
          height: 90vh;
          overflow-y: auto;
          padding: 1rem;
          background-color: #f8f9fa;
        }
        
        /* Mobile Offcanvas */
        .left-panel-mobile, .right-panel-mobile {
          width: 85% !important;
        }
        
        @media (max-width: 991.98px) {
          .fixed-bottom-buttons {
            display: none;
          }
        }
      `}</style>
    </Container>
  );
}