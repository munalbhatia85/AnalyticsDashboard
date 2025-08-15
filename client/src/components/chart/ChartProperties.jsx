/**
 * Chart Properties Panel
 * 
 * Contains controls for configuring chart properties:
 * - Chart title
 * - X-axis selection (multiple allowed)
 * - Y-axis selection (multiple for some chart types)
 * - Validation messages
 */
import { Form, Button, Alert } from 'react-bootstrap';
import { chartTypes } from './chartUtils';

export default function ChartProperties({
  dataset,
  chartType,
  xAxes,
  yAxes,
  title,
  validationError,
  onXAxesChange,
  onYAxesChange,
  onTitleChange,
  onValidationError,
}) {
  // Get current chart type configuration
  //const currentChartType = chartTypes.find(ct => ct.type === chartType);
  
  // Get available columns from selected dataset
//   const columns = dataset?.data?.data[0] 
//     ? Object.keys(dataset.data.data[0]) 
//     : [];

  /**
   * Handles multi-select changes with validation
   * @param {function} setter - State setter function
   * @param {number} maxSelections - Maximum allowed selections
   */
//   const handleMultiSelectChange = (setter, maxSelections = Infinity) => (e) => {
//     const selected = Array.from(e.target.selectedOptions, option => option.value);
    
//     if (selected.length > maxSelections) {
//       onValidationError(`Maximum ${maxSelections} selection${maxSelections > 1 ? 's' : ''} allowed`);
//       return;
//     }
    
//     setter(selected);
//     onValidationError('');
//   };

  // Clear selection helper
//   const clearSelection = (setter) => {
//     setter([]);
//     onValidationError('');
//   };
  const handleSave = () => {
    const config = {
      dataset: dataset?.data?.tableName,
      chartType,
      xAxes,
      yAxes,
      title,

      timestamp: new Date().toISOString()
    };

    // Create downloadable JSON without file-saver
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `chart-config-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };
  return (
    <div className="chart-properties">
      <h5 className="mb-4">Chart Configuration</h5>
      
      {/* Chart Title Control */}
      <Form.Group className="mb-4">
        <Form.Label>Chart Title</Form.Label>
        <div className="d-flex gap-2">
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Enter chart title"
            disabled={!dataset}
          />
          <Button 
            variant="outline-secondary" 
            onClick={() => onTitleChange('')}
            disabled={!title || !dataset}
          >
            Clear
          </Button>
        </div>
      </Form.Group>

      {/* X-Axis Selection */}
      {/* <Form.Group className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Form.Label>X-Axis Dimensions</Form.Label>
          <Button 
            variant="outline-danger" 
            size="sm"
            onClick={() => clearSelection(onXAxesChange)}
            disabled={!xAxes.length || !dataset}
          >
            Clear All
          </Button>
        </div>
        <Form.Control
          as="select"
          multiple
          value={xAxes}
          onChange={handleMultiSelectChange(onXAxesChange)}
          size="sm"
          disabled={!dataset}
        >
          {columns.map(col => (
            <option key={col} value={col}>{col}</option>
          ))}
        </Form.Control>
        <Form.Text className="text-muted">
          {xAxes.length > 1
            ? `Composite labels: ${xAxes.join(' + ')}`
            : 'Select 1+ dimensions for X-axis'}
        </Form.Text>
      </Form.Group> */}

      {/* Y-Axis Selection */}
      {/* <Form.Group className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <Form.Label className="me-2">Y-Axis Values</Form.Label>
            {!currentChartType?.supportsMultiY && (
              <span className="badge bg-warning text-dark">Single Only</span>
            )}
          </div>
          <Button 
            variant="outline-danger" 
            size="sm"
            onClick={() => clearSelection(onYAxesChange)}
            disabled={!yAxes.length || !dataset}
          >
            Clear All
          </Button>
        </div>
        <Form.Control
          as="select"
          multiple
          value={yAxes}
          onChange={handleMultiSelectChange(
            onYAxesChange, 
            currentChartType?.supportsMultiY ? Infinity : 1
          )}
          size="sm"
          disabled={!dataset}
        >
          {columns.map(col => (
            <option key={col} value={col}>{col}</option>
          ))}
        </Form.Control>
        <Form.Text className="text-muted">
          {currentChartType?.supportsMultiY
            ? 'Select 1+ values to display'
            : 'Select exactly one value'}
        </Form.Text>
      </Form.Group> */}
     <Button 
        variant="primary" 
        onClick={handleSave}
        disabled={!dataset}
        className="w-100 mt-3"
      >
        Save Configuration
      </Button>
      {/* Validation Messages */}
      {validationError && (
        <Alert 
          variant="danger" 
          dismissible 
          onClose={() => onValidationError('')}
          className="mt-3"
        >
          {validationError}
        </Alert>
      )}
    </div>
  );
}