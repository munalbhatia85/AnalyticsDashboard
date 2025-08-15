import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
// import Dashboard   from './pages/dashboard';
// import DataHandler from './pages/dataHandler';
import DataView  from './pages/dataView';
import DatasetViewer from './pages/datasetViewer';
import ChartBuilder from './pages/ChartBuilder';
import DashboardBuilder from './pages/dashboard'

import 'tabulator-tables/dist/css/tabulator.min.css';
import 'react-tabulator/lib/styles.css'; // optional if you're using react-tabulator styles
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  return (
    <>
    
      <Navbar />
      <Routes>
  
        <Route path="/" element={<DataView />} />
        <Route path="/DatasetViewer" element={<DatasetViewer />} />
        <Route path="/ChartBuilder" element={<ChartBuilder />} />
        <Route path="/DashboardBuilder" element={<DashboardBuilder />} />
        
      </Routes>
    </>
  )
}

export default App
