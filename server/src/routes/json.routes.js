const express = require('express');
const router = express.Router();
const controller = require('../controllers/json.controller');

router.post('/', controller.createJson);
router.get('/', controller.getAllJson);
router.get('/:id', controller.getJsonById);
router.put('/:id', controller.updateJson);
router.delete('/:id', controller.deleteJson);

module.exports = router;
