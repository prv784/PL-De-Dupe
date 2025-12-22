import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dedupeAPI } from '../services/api';
import { motion } from 'framer-motion';
import { 
  HiDownload, 
  HiSearch, 
  HiFilter,
  HiEye,
  HiDocumentText,
  HiTable,
  HiClipboardList,
  HiCalendar
} from 'react-icons/hi';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    fetchHistory();
  }, [pagination.page, filter]);

  const fetchHistory = async () => {
    try {
      const response = await dedupeAPI.getHistory({
        page: pagination.page,
        limit: pagination.limit
      });
      
      if (response.data.success) {
        setHistory(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (historyId, format) => {
    try {
      const response = await dedupeAPI.download(historyId, format);
      
      // Get filename from content-disposition header
      const contentDisposition = response.headers['content-disposition'];
      let filename = `de-duplicated-${historyId}.${format}`;
      
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) filename = match[1];
      }

      // Create blob and download
      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] 
      });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Download error:', error);
      alert('Error downloading file: ' + (error.response?.data?.message || error.message));
    }
  };

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.originalFilename.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || item.fileType === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">De-duplication History</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Track all your processed files and results</p>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card dark:bg-gray-800 mb-6"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by filename..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-10"
            />
          </div>
          <div className="flex items-center gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="csv">CSV</option>
              <option value="xlsx">Excel</option>
              <option value="json">JSON</option>
              <option value="manual">Manual Input</option>
            </select>
            <HiFilter className="w-5 h-5 text-gray-500" />
          </div>
        </div>
      </motion.div>

      {/* History Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card dark:bg-gray-800 overflow-hidden"
      >
        {filteredHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    File Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Records
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Duplicates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredHistory.map((item, index) => (
                  <motion.tr
                    key={item._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {item.fileType === 'csv' ? (
                          <HiTable className="w-4 h-4 text-blue-500 mr-2" />
                        ) : item.fileType === 'manual' ? (
                          <HiClipboardList className="w-4 h-4 text-yellow-500 mr-2" />
                        ) : (
                          <HiDocumentText className="w-4 h-4 text-green-500 mr-2" />
                        )}
                        <div className="max-w-[200px] truncate" title={item.originalFilename}>
                          {item.originalFilename}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${
                        item.fileType === 'csv' ? 'badge-success' :
                        item.fileType === 'xlsx' ? 'badge-warning' :
                        item.fileType === 'json' ? 'badge-error' :
                        'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                      }`}>
                        {item.fileType.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <span className="font-medium dark:text-white">{item.uniqueRecords}</span>
                        <span className="text-gray-500 dark:text-gray-400"> / {item.totalRecords}</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {(item.duplicateCount / item.totalRecords * 100).toFixed(1)}% duplicates
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-red-600 dark:text-red-400 font-medium">
                        {item.duplicateCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <HiCalendar className="w-4 h-4 mr-2" />
                        {new Date(item.processedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/history/${item._id}`}
                          className="text-primary hover:text-primary/80 p-2 bg-primary/10 rounded-lg"
                          title="View Details"
                        >
                          <HiEye className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDownload(item._id, 'csv')}
                          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
                          title="Download CSV"
                        >
                          <HiDownload className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <HiDocumentText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No de-duplication history found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              {search || filter !== 'all' 
                ? 'Try changing your search or filter' 
                : 'Upload your first file to get started'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 border dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-1 border dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default History;