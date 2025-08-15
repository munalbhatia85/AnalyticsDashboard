import React, { useEffect, useState,useRef  } from 'react';
import { Container, Row, Col, ListGroup, Alert, Button } from 'react-bootstrap';
import { ReactTabulator } from 'react-tabulator';
import 'tabulator-tables/dist/css/tabulator.min.css';
import 'react-tabulator/lib/styles.css';
import api from './../services/api';

export default function DatasetViewer() {
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [error, setError] = useState('');
  const [tableRef, setTableRef] = useState(null);
  //const tableRef = useRef(null);
  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const res = await api.get('/json');
        setDatasets(res.data);
      } catch (err) {
        setError('Failed to fetch datasets');
      }
    };
    fetchDatasets();
  }, []);

  const handleSelect = (dataset) => {
    setSelectedDataset(dataset);
  };

const download = (format) => {
  if (!tableRef) return;

  const fileName = selectedDataset?.data?.tableName || 'dataset';

  if (format === 'csv') tableRef.current.download('csv', `${fileName}.csv`);
  if (format === 'xlsx') {
    tableRef.current.download('xlsx', `${fileName}.xlsx`, { sheetName: fileName });
  }
  if (format === 'pdf') {
    tableRef.current.download('pdf', `${fileName}.pdf`, {
      orientation: 'landscape',
      title: fileName,
    });
  }
};


  const columns = selectedDataset?.data?.data?.length
    ? Object.keys(selectedDataset.data.data[0]).map((key) => ({
        title: key,
        field: key,
        headerFilter: true,
        sorter: 'string',
        hozAlign: 'left',
      }))
    : [];

  return (
    <Container fluid className="my-4">
      <Row>
        {/* Sidebar */}
        <Col md={3}>
          <h4 className="mb-3">Datasets</h4>
          <ListGroup>
            {datasets.map((ds, i) => (
              <ListGroup.Item
                key={i}
                action
                active={selectedDataset?._id === ds._id}
                onClick={() => handleSelect(ds)}
              >
                {ds.data?.tableName || 'Untitled Dataset'}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        {/* Table View */}
        <Col md={9}>
          <h4 className="mb-3">
            {selectedDataset?.data?.tableName || 'Data Table'}
          </h4>
          {error && <Alert variant="danger">{error}</Alert>}

          {selectedDataset?.data?.data?.length > 0 ? (
            <>
              <div className="d-flex gap-2 mb-3">
                <Button size="sm" variant="outline-primary" onClick={() => download('csv')}>
                  Download CSV
                </Button>
                <Button size="sm" variant="outline-success" onClick={() => download('xlsx')}>
                  Download Excel
                </Button>
                <Button size="sm" variant="outline-danger" onClick={() => download('pdf')}>
                  Download PDF
                </Button>
              </div>

              {/* <ReactTabulator
                data={selectedDataset.data.data}
                columns={columns}
                options={{
                  layout: 'fitDataStretch',
                  movableColumns: true,
                  pagination: true,
                  paginationSize: 10,
                  height: '500px',
                  responsiveLayout: 'collapse',
                }}
                onRef={(ref) => setTableRef(ref)}
              /> */}
              <ReactTabulator
                
                data={selectedDataset.data.data}
                columns={columns}
                options={{
                  layout: 'fitDataStretch',
                  movableColumns: true,
                  pagination: true,
                  paginationSize: 10,
                  height: '500px',
                  responsiveLayout: 'collapse',
                }}
                 onRef={(ref) => setTableRef(ref)}
              />
            </>
          ) : (
            <p>No data available for the selected dataset.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
}
