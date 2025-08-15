const JsonModel = require('../models/json.model');

// Create
exports.createJson = async (req, res) => {
  try {
    const doc = await JsonModel.create({ data: req.body });
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Read All
exports.getAllJson = async (req, res) => {
  try {
    const docs = await JsonModel.find();
    res.status(200).json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Read One
exports.getJsonById = async (req, res) => {
  try {
    const doc = await JsonModel.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
exports.updateJson = async (req, res) => {
  try {
    const doc = await JsonModel.findByIdAndUpdate(
      req.params.id,
      { data: req.body },
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete
exports.deleteJson = async (req, res) => {
  try {
    const doc = await JsonModel.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
