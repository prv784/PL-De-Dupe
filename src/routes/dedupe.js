const express = require('express');
const router = express.Router();
const dedupeController = require('../controllers/dedupeController');
const historyController = require('../controllers/historyController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Process de-duplication
router.post('/process', auth, upload.single('file'), dedupeController.processDedupe);

// Download files
router.get('/download/:historyId/:format', auth, dedupeController.downloadFile);

// History routes
router.get('/history', auth, historyController.getHistory);
router.get('/history/:id', auth, historyController.getHistoryById);
router.get('/statistics', auth, historyController.getStatistics);

module.exports = router;