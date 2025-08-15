import React, { useState } from 'react';
import {
  Button, Form, Container, ToggleButtonGroup, ToggleButton, Alert
} from 'react-bootstrap';
import api from './../services/api';

export default function DataView() {
  const [mode, setMode] = useState('credentials');
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [datasetName, setDatasetName] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    setUploadedFile(e.target.files[0]);
  };

  const sendToApi = async (data) => {
    try {
      await api.post('/json', data);
      setSuccess('Data saved successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to save data to API');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!datasetName) {
      setError('Dataset name is required');
      return;
    }

    if (mode === 'credentials') {
      console.log('Connecting with credentials:', credentials);
    } else if (mode === 'json') {
      try {
        const parsed = JSON.parse(jsonInput);
        sendToApi({ tableName: datasetName, data: parsed });
      } catch (err) {
        setError('Invalid JSON input');
      }
    } else if (mode === 'upload') {
      if (uploadedFile) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const parsed = JSON.parse(event.target.result);
            sendToApi({ tableName: datasetName, data: parsed });
          } catch (err) {
            setError('Uploaded file is not valid JSON');
          }
        };
        reader.readAsText(uploadedFile);
      } else {
        setError('Please select a JSON file to upload');
      }
    }
  };

  return (
    <Container className="my-4">
      <h2 className="mb-4">Connect to Data</h2>

      <ToggleButtonGroup
        type="radio"
        name="options"
        value={mode}
        onChange={(val) => setMode(val)}
        className="mb-4"
      >
        <ToggleButton id="cred" variant={mode === 'credentials' ? 'primary' : 'outline-secondary'} value="credentials">
          Credentials
        </ToggleButton>
        <ToggleButton id="json" variant={mode === 'json' ? 'primary' : 'outline-secondary'} value="json">
          Paste JSON
        </ToggleButton>
        <ToggleButton id="upload" variant={mode === 'upload' ? 'primary' : 'outline-secondary'} value="upload">
          Upload File
        </ToggleButton>
      </ToggleButtonGroup>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        {(mode === 'json' || mode === 'upload') && (
          <Form.Group className="mb-3">
            <Form.Label>Dataset Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter dataset name"
              value={datasetName}
              onChange={(e) => setDatasetName(e.target.value)}
              required
            />
          </Form.Group>
        )}

        {mode === 'credentials' && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Username or API Key</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username or API key"
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
              />
            </Form.Group>
          </>
        )}

        {mode === 'json' && (
          <Form.Group className="mb-3">
            <Form.Label>Paste JSON</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              placeholder="Paste your JSON here..."
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              required
            />
          </Form.Group>
        )}

        {mode === 'upload' && (
          <Form.Group className="mb-3">
            <Form.Label>Upload JSON File</Form.Label>
            <Form.Control
              type="file"
              accept=".json"
              onChange={handleFileChange}
              required
            />
          </Form.Group>
        )}

        <Button type="submit" variant="success">Submit</Button>
      </Form>
    </Container>
  );
}
