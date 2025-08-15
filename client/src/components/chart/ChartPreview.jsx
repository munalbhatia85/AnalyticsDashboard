import { Card, Alert, Spinner } from 'react-bootstrap';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { chartTypes, COLORS, getChartData, composeMultiYScales } from './chartUtils';

export default function ChartPreview({ dataset, chartType, xAxes, yAxes, title }) {
  if (!dataset) {
    return (
      <Alert variant="info">
        Please select a dataset to begin.
      </Alert>
    );
  }

  const chartData = getChartData(dataset, chartType, xAxes, yAxes);
  const currentChartType = chartTypes.find(ct => ct.type === chartType);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: !!title, text: title },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) {
              label += context.parsed.y.toLocaleString();
            }
            return label;
          }
        }
      }
    },
    scales: (chartType === 'Line' || chartType === 'Bar') 
      ? composeMultiYScales(xAxes, yAxes) 
      : {},
  };

  if (!xAxes.length || !yAxes.length) {
    return (
      <Alert variant="warning">
        {!xAxes.length && !yAxes.length 
          ? "Please select at least one X axis and one Y axis."
          : !xAxes.length 
            ? "Please select at least one X axis."
            : "Please select at least one Y axis."}
        <br />
        {!currentChartType.supportsMultiY
          ? "This chart type requires exactly one Y axis."
          : "Hold Ctrl/Cmd to select multiple axes."}
      </Alert>
    );
  }

  if (!chartData) {
    return (
      <Alert variant="danger">
        Invalid configuration for {chartType} chart.
      </Alert>
    );
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Chart Preview</h5>
        <div>
          <small className="text-muted me-2">
            {dataset.data.tableName}
          </small>
          <span className="badge bg-secondary">
            {chartType} Chart
          </span>
        </div>
      </div>
      <Card className="p-3" style={{ minHeight: '400px' }}>
        {chartType === 'Line' && <Line data={chartData} options={options} />}
        {chartType === 'Bar' && <Bar data={chartData} options={options} />}
        {chartType === 'Pie' && <Pie data={chartData} options={options} />}
        {chartType === 'Doughnut' && <Doughnut data={chartData} options={options} />}
      </Card>
    </>
  );
}