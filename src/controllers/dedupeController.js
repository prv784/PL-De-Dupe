const DedupeHistory = require('../models/DedupeHistory');
const FileParser = require('../utils/fileParser');
const DedupeLogic = require('../utils/dedupeLogic');
const XLSX = require('xlsx');
const path = require('path');

// Process de-duplication
exports.processDedupe = async (req, res) => {
    try {
        let plNumbers = [];
        let originalFilename = '';
        let fileType = '';

        // Handle file upload
        if (req.file) {
            const fileBuffer = req.file.buffer;
            originalFilename = req.file.originalname;
            const ext = path.extname(originalFilename).toLowerCase().slice(1);
            fileType = ext;
            
            // Parse based on file type
            switch (ext) {
                case 'csv':
                    const csvContent = fileBuffer.toString('utf8');
                    plNumbers = FileParser.parseCSV(csvContent);
                    break;
                    
                case 'xlsx':
                case 'xls':
                    plNumbers = FileParser.parseExcel(fileBuffer);
                    break;
                    
                case 'json':
                    const jsonContent = fileBuffer.toString('utf8');
                    plNumbers = FileParser.parseJSON(jsonContent);
                    break;
                    
                default:
                    return res.status(400).json({
                        success: false,
                        message: 'Unsupported file format'
                    });
            }
        }
        // Handle manual input
        else if (req.body.manualInput) {
            plNumbers = FileParser.parseManualInput(req.body.manualInput);
            originalFilename = 'manual-input.txt';
            fileType = 'manual';
        }
        else {
            return res.status(400).json({
                success: false,
                message: 'No file or input provided'
            });
        }

        // Validate data
        if (plNumbers.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid PL numbers found in the input'
            });
        }

        // Apply de-duplication
        const { uniqueData, duplicateCount } = DedupeLogic.removeDuplicates(plNumbers);

        // Save to history
        const history = new DedupeHistory({
            userId: req.user.id,
            originalFilename,
            fileType,
            totalRecords: plNumbers.length,
            uniqueRecords: uniqueData.length,
            duplicateCount,
            purifiedData: uniqueData
        });

        await history.save();

        // Prepare response
        const response = {
            success: true,
            data: {
                originalCount: plNumbers.length,
                uniqueCount: uniqueData.length,
                duplicateCount,
                uniqueData: uniqueData.slice(0, 100), // Return first 100 for preview
                historyId: history._id,
                duplicatePercentage: ((duplicateCount / plNumbers.length) * 100).toFixed(2)
            }
        };

        res.json(response);
    } catch (error) {
        console.error('Dedupe error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing de-duplication: ' + error.message
        });
    }
};

// Download purified data
exports.downloadFile = async (req, res) => {
    try {
        const { historyId, format } = req.params;
        
        // Find history record
        const history = await DedupeHistory.findOne({
            _id: historyId,
            userId: req.user.id
        });
        
        if (!history) {
            return res.status(404).json({
                success: false,
                message: 'Record not found'
            });
        }

        let data, filename, contentType;

        switch (format) {
            case 'csv':
                data = history.purifiedData.join('\n');
                filename = `purified-${history.originalFilename.replace(/\.[^/.]+$/, '')}.csv`;
                contentType = 'text/csv';
                break;
                
            case 'xlsx':
                const worksheet = XLSX.utils.aoa_to_sheet(history.purifiedData.map(item => [item]));
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Purified Data');
                data = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
                filename = `purified-${history.originalFilename.replace(/\.[^/.]+$/, '')}.xlsx`;
                contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                break;
                
            case 'json':
                data = JSON.stringify(history.purifiedData, null, 2);
                filename = `purified-${history.originalFilename.replace(/\.[^/.]+$/, '')}.json`;
                contentType = 'application/json';
                break;
                
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid format'
                });
        }

        // Set headers and send file
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', contentType);
        res.send(data);
        
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({
            success: false,
            message: 'Error downloading file'
        });
    }
};