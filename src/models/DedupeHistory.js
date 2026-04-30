const mongoose = require('mongoose');

const DedupeHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    originalFilename: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        enum: ['csv', 'xlsx', 'json', 'manual'],
        required: true
    },
    totalRecords: {
        type: Number,
        required: true,
        min: 0
    },
    uniqueRecords: {
        type: Number,
        required: true,
        min: 0
    },
    duplicateCount: {
        type: Number,
        required: true,
        min: 0
    },
    purifiedData: {
        type: [String],
        required: true
    },
    processedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('DedupeHistory', DedupeHistorySchema);