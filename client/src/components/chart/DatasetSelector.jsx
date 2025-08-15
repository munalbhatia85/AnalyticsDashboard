/**
 * Dataset Selector Component
 * 
 * Displays available datasets and allows user selection
 * Shows loading state and error messages when applicable
 */
import { ListGroup, Spinner, Alert } from 'react-bootstrap';
import { chartTypes } from './chartUtils';
import { Form } from 'react-bootstrap';
export default function DatasetSelector({ 
  datasets, 
  selectedDataset, 
  onSelect, 
  loading, 
  error ,
   xAxes,
  yAxes,
  onXAxesChange,
  onYAxesChange,
  chartType
}) {
    const currentChartType = chartTypes.find(ct => ct.type === chartType);
  const columns = selectedDataset?.data?.data[0] ? Object.keys(selectedDataset.data.data[0]) : [];

  const handleMultiSelectChange = (setter, maxSelections = Infinity) => (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setter(selected);
  };
  // Loading state
  if (loading) {
    return (
      <div className="text-center py-3">
        <Spinner animation="border" size="sm" />
        <p className="mt-2">Loading datasets...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Data Load Error</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  // Main dataset list
  return (
    <>
      <h5 className="mb-3">Available Datasets</h5>
      <ListGroup>
        {datasets.map((ds) => (
          <ListGroup.Item
            key={ds._id}
            action
            active={selectedDataset?._id === ds._id}
            onClick={() => onSelect(ds)}
            className="mb-2"
          >
            <div className="d-flex justify-content-between">
              <strong>{ds.data.tableName}</strong>
              <span className="badge bg-primary">
                {ds.data.data.length} records
              </span>
            </div>
            <small className="text-muted d-block mt-1">
              {Object.keys(ds.data.data[0] || {}).join(', ')}
            </small>
          </ListGroup.Item>
        ))}
      </ListGroup>
        {/* Add Axis Controls Here */}
        {selectedDataset && (
          <div className="axis-controls mt-4">
            <Form.Group className="mb-3">
              <Form.Label>X-Axis Dimensions</Form.Label>
              <Form.Control
                as="select"
                multiple
                value={xAxes}
                onChange={handleMultiSelectChange(onXAxesChange)}
                size="sm"
              >
                {columns.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Y-Axis Values
                {!currentChartType?.supportsMultiY && (
                  <span className="ms-2 badge bg-warning text-dark">Single Only</span>
                )}
              </Form.Label>
              <Form.Control
                as="select"
                multiple
                value={yAxes}
                onChange={handleMultiSelectChange(
                  onYAxesChange, 
                  currentChartType?.supportsMultiY ? Infinity : 1
                )}
                size="sm"
              >
                {columns.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </div>
        )}
    </>
  );
}