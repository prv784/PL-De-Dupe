const DedupeHistory = require('../models/DedupeHistory');

// Get all history for user
exports.getHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const history = await DedupeHistory.find({ userId: req.user.id })
      .sort({ processedAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await DedupeHistory.countDocuments({ userId: req.user.id });
    
    res.json({
      success: true,
      data: history,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching history'
    });
  }
};

// Get single history record
exports.getHistoryById = async (req, res) => {
  try {
    const history = await DedupeHistory.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!history) {
      return res.status(404).json({
        success: false,
        message: 'History record not found'
      });
    }
    
    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Get history by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching history details'
    });
  }
};

// Get statistics
exports.getStatistics = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's history
    const userHistory = await DedupeHistory.find({ userId });
    
    // Calculate stats
    const totalFiles = userHistory.length;
    const totalRecords = userHistory.reduce((sum, history) => sum + (history.totalRecords || 0), 0);
    const totalDuplicates = userHistory.reduce((sum, history) => sum + (history.duplicateCount || 0), 0);
    const avgDuplicatePercentage = totalRecords > 0 
      ? parseFloat(((totalDuplicates / totalRecords) * 100).toFixed(2))
      : 0;
    
    // Get most common duplicates from recent history
    const recentHistory = await DedupeHistory.find({ userId })
      .sort({ processedAt: -1 })
      .limit(20);

    // Extract all PL numbers for frequency analysis
    const allNumbers = [];
    recentHistory.forEach(history => {
      if (history.purifiedData && Array.isArray(history.purifiedData)) {
        allNumbers.push(...history.purifiedData);
      }
    });

    // Calculate most common duplicates
    const frequency = {};
    allNumbers.forEach(num => {
      if (num && typeof num === 'string') {
        frequency[num] = (frequency[num] || 0) + 1;
      }
    });

    const mostCommon = Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([number, count]) => ({ number, count }));

    // Get daily stats for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyStats = await DedupeHistory.aggregate([
      { 
        $match: { 
          userId: userId,
          processedAt: { $gte: sevenDaysAgo }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$processedAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const response = {
      success: true,
      data: {
        totalFiles,
        totalRecords,
        totalDuplicates,
        avgDuplicatePercentage,
        mostCommon,
        dailyStats: dailyStats || []
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics'
    });
  }
};