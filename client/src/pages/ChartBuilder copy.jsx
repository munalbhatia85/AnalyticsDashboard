import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, ListGroup, Card } from 'react-bootstrap';
import api from './../services/api';
import {
  Bar, Line, Pie, Doughnut, Radar, PolarArea, Scatter, Bubble
} from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  LogarithmicScale,
  TimeScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  BubbleController,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,         // for Bar/Line charts
  LinearScale,           // for Bar/Line/Scatter/Bubble
  RadialLinearScale,     // for Radar/PolarArea
  BarElement,            // for Bar chart
  LineElement,           // for Line chart
  PointElement,          // for Line/Scatter/Bubble
  ArcElement,            // for Pie/Doughnut/PolarArea
  Tooltip,
  Legend
);


const chartTypes = [
  { type: 'Bar' },
  { type: 'Line' },
  { type: 'Pie' },
  { type: 'Doughnut' },
  { type: 'Radar' },
  { type: 'PolarArea' },
  { type: 'Scatter' },
  { type: 'Bubble' },
];

export default function ChartBuilder() {
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [columns, setColumns] = useState([]);
  const [selectedChart, setSelectedChart] = useState('Bar');
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get('/json');
      setDatasets(res.data);
    };
    fetchData();
  }, []);

  const handleDatasetSelect = (ds) => {
    setSelectedDataset(ds);
    const keys = ds.data.data.length > 0 ? Object.keys(ds.data.data[0]) : [];
    setColumns(keys);
    setXAxis('');
    setYAxis('');
  };

  const getBarLinePieDoughnutData = () => {
    const labels = selectedDataset.data.data.map(row => row[xAxis]);
    const values = selectedDataset.data.data.map(row => Number(row[yAxis]));

    return {
      labels,
      datasets: [{
        label: yAxis,
        data: values,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      }],
    };
  };

  const getRadarPolarData = () => {
    const labels = selectedDataset.data.data.map(row => row[xAxis]);
    const values = selectedDataset.data.data.map(row => Number(row[yAxis]));

    return {
      labels,
      datasets: [{
        label: yAxis,
        data: values,
        backgroundColor: 'rgba(255,99,132,0.5)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
      }],
    };
  };

const getScatterData = () => ({
  datasets: [
    {
      label: yAxis,
      data: selectedDataset.data.data.map(row => ({
        x: Number(row[xAxis]),
        y: Number(row[yAxis]),
      })),
      backgroundColor: 'rgba(75,192,192,1)',
    },
  ],
});

const getBubbleData = () => ({
  datasets: [
    {
      label: yAxis,
      data: selectedDataset.data.data.map(row => ({
        x: Number(row[xAxis]),
        y: Number(row[yAxis]),
        r: Math.random() * 10 + 5, // Replace with a real column if available
      })),
      backgroundColor: 'rgba(255,99,132,0.5)',
    },
  ],
});

  const getChartData = () => {
    if (!selectedDataset || !xAxis || !yAxis) return null;

    switch (selectedChart) {
      case 'Radar':
      case 'PolarArea':
        return getRadarPolarData();
      case 'Scatter':
        return getScatterData();
      case 'Bubble':
        return getBubbleData();
      default:
        return getBarLinePieDoughnutData();
    }
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: !!title, text: title }
    }
  };
  const renderChart = () => {
    const chartData = getChartData();

    if (!chartData) return <p>Select dataset and columns to view chart.</p>;

    switch (selectedChart) {
      case 'Bar': return <Bar data={chartData} options={options} />;
      case 'Line': return <Line data={chartData} options={options} />;
      case 'Pie': return <Pie data={chartData} options={options} />;
      case 'Doughnut': return <Doughnut data={chartData} options={options} />;
      case 'Radar': return <Radar data={chartData} options={options} />;
      case 'PolarArea': return <PolarArea data={chartData} options={options} />;
      case 'Scatter': return <Scatter data={chartData} options={options} />;
      case 'Bubble': return <Bubble data={chartData} options={options} />;
      default: return null;
    }
  };


  return (
    <Container fluid className="my-4">
      <Row>
        {/* Left Panel */}
        <Col md={3}>
          <h5>Datasets</h5>
          <ListGroup>
            {datasets.map((ds, i) => (
              <ListGroup.Item
                key={i}
                action
                active={selectedDataset?._id === ds._id}
                onClick={() => handleDatasetSelect(ds)}
              >
                {ds.data?.tableName || 'Untitled'}
              </ListGroup.Item>
            ))}
          </ListGroup>

          <h5 className="mt-4">Chart Type</h5>
          <div className="d-flex gap-2 flex-wrap">
            {chartTypes.map(({ type }) => (
              <div
                key={type}
                onClick={() => setSelectedChart(type)}
                title={type}
                className={`p-2 border rounded shadow-sm text-center ${
                  selectedChart === type ? 'bg-primary text-white' : 'bg-light text-dark'
                }`}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: 80,
                  height: 60,
                  justifyContent: 'center',
                  fontWeight: '500',
                }}
              >
                {type}
              </div>
            ))}
          </div>
        </Col>

        {/* Main Chart Area */}
        <Col md={6}>
          <h5>Chart Preview</h5>
          <Card className="p-3">
            {renderChart()}
          </Card>
        </Col>

        {/* Right Panel: Chart Properties */}
        <Col md={3}>
          <h5>Chart Properties</h5>
          <Form.Group className="mb-2">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>X Axis</Form.Label>
            <Form.Select value={xAxis} onChange={(e) => setXAxis(e.target.value)}>
              <option value="">-- Select --</option>
              {columns.map((col, i) => (
                <option key={i} value={col}>{col}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Y Axis</Form.Label>
            <Form.Select value={yAxis} onChange={(e) => setYAxis(e.target.value)}>
              <option value="">-- Select --</option>
              {columns.map((col, i) => (
                <option key={i} value={col}>{col}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
    </Container>
  );
}
