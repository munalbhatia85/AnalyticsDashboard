import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Register all components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export const chartTypes = [
  { type: 'Line', supportsMultiY: true },
  { type: 'Bar', supportsMultiY: true },
  { type: 'Pie', supportsMultiY: false },
  { type: 'Doughnut', supportsMultiY: false },
];

export const COLORS = [
  'rgba(54, 162, 235, 0.5)',
  'rgba(255, 99, 132, 0.5)',
  'rgba(255, 206, 86, 0.5)',
  'rgba(75, 192, 192, 0.5)',
  'rgba(153, 102, 255, 0.5)',
  'rgba(255, 159, 64, 0.5)',
];

export const getChartData = (dataset, chartType, xAxes, yAxes) => {
  if (!dataset || !xAxes.length || !yAxes.length) return null;
  
  const chartTypeObj = chartTypes.find(ct => ct.type === chartType);
  if (!chartTypeObj.supportsMultiY && yAxes.length > 1) return null;

  if (chartType === 'Pie' || chartType === 'Doughnut') {
    const labels = dataset.data.data.map(row => xAxes.map(ax => row[ax]).join(' | '));
    const yCol = yAxes[0];
    const values = dataset.data.data.map(row => {
      const value = row[yCol];
      return typeof value === 'number' ? value : parseFloat(value) || 0;
    });
    return {
      labels,
      datasets: [{
        label: yCol,
        data: values,
        backgroundColor: COLORS.slice(0, values.length),
        borderWidth: 1,
      }]
    };
  }

  // Line/Bar chart data
  const labels = dataset.data.data.map(row => xAxes.map(ax => row[ax]).join(' | '));
  const datasetsConfig = yAxes.map((yCol, idx) => ({
    label: yCol,
    data: dataset.data.data.map(row => {
      const value = row[yCol];
      return typeof value === 'number' ? value : parseFloat(value) || 0;
    }),
    borderColor: COLORS[idx % COLORS.length],
    backgroundColor: COLORS[idx % COLORS.length],
    yAxisID: `y${idx + 1}`,
    type: chartType.toLowerCase(),
    fill: false,
  }));
  return { labels, datasets: datasetsConfig };
};

export const composeMultiYScales = (xAxes, yAxes) => {
  const scales = {
    x: { display: true, title: { display: true, text: xAxes.join(' | ') } }
  };
  yAxes.forEach((yCol, idx) => {
    scales[`y${idx + 1}`] = {
      type: 'linear',
      display: true,
      position: idx % 2 === 0 ? 'left' : 'right',
      offset: idx > 1,
      title: { display: true, text: yCol }
    };
  });
  return scales;
};