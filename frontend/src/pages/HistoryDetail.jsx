import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dedupeAPI } from '../services/api';
import { motion } from 'framer-motion';
import {
  HiArrowLeft,
  HiDownload,
  HiCalendar,
  HiDocumentText,
  HiCheckCircle,
  HiXCircle,
  HiClipboardList
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const HistoryDetail = () => {
  const { id } = useParams();
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewData, setPreviewData] = useState([]);

  useEffect(() => {
    fetchHistoryDetail();
  }, [id]);

  const fetchHistoryDetail = async () => {
    try {
      const response = await dedupeAPI.getHistoryById(id);
      if (response.data.success) {
        setHistory(response.data.data);
        // Show preview of first 20 items
        setPreviewData(response.data.data.purifiedData.slice(0, 20));
      }
    } catch (error) {
      toast.error('Error loading history details');
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (format) => {
    if (!history) return;

    try {
      const response = await dedupeAPI.download(history._id, format);
      
      // Get filename from content-disposition header
      const contentDisposition = response.headers['content-disposition'];
      let filename = `de-duplicated-${history._id}.${format}`;
      
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) filename = match[1];
      }

      // Create blob and download
      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] 
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Download started!');
    } catch (error) {
      toast.error('Error downloading file');
      console.error('Download error:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  if (!history) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <HiXCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">History Not Found</h2>
          <p className="text-gray-600 mb-6">The requested history record could not be found.</p>
          <Link to="/history" className="btn-primary inline-flex items-center">
            <HiArrowLeft className="w-4 h-4 mr-2" />
            Back to History
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/history"
          className="inline-flex items-center text-primary hover:text-primary/80 mb-4"
        >
          <HiArrowLeft className="w-4 h-4 mr-2" />
          Back to History
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">History Details</h1>
            <p className="text-gray-600 mt-2">Detailed view of de-duplication results</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleDownload('csv')}
              className="btn-primary flex items-center gap-2 px-4 py-2"
            >
              <HiDownload className="w-4 h-4" />
              Download CSV
            </button>
            <button
              onClick={() => handleDownload('json')}
              className="btn-secondary flex items-center gap-2 px-4 py-2"
            >
              <HiDownload className="w-4 h-4" />
              Download JSON
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <HiDocumentText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Original Records</p>
              <p className="text-2xl font-bold">{history.totalRecords}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <HiCheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Unique Records</p>
              <p className="text-2xl font-bold">{history.uniqueRecords}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-lg mr-4">
              <HiXCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Duplicates Removed</p>
              <p className="text-2xl font-bold">{history.duplicateCount}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg mr-4">
              <HiCalendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Processed On</p>
              <p className="text-sm font-medium">
                {new Date(history.processedAt).toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(history.processedAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* File Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="card">
          <h2 className="text-xl font-bold mb-6">File Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Filename</p>
              <p className="font-medium">{history.originalFilename}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">File Type</p>
              <span className={`badge ${
                history.fileType === 'csv' ? 'badge-success' :
                history.fileType === 'xlsx' ? 'badge-warning' :
                history.fileType === 'json' ? 'badge-error' :
                'bg-gray-100 text-gray-800'
              }`}>
                {history.fileType.toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Duplicate Percentage</p>
              <p className="font-medium">
                {((history.duplicateCount / history.totalRecords) * 100).toFixed(2)}%
              </p>
            </div>
          </div>
        </div>

        {/* Efficiency Metrics */}
        <div className="card">
          <h2 className="text-xl font-bold mb-6">Efficiency Metrics</h2>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">Space Saved</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <motion.div 
                  className="bg-green-600 h-2.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((history.duplicateCount / history.totalRecords) * 100)}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Removed {history.duplicateCount} redundant entries
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-primary">
                  {Math.round((history.uniqueRecords / history.totalRecords) * 100)}%
                </p>
                <p className="text-sm text-gray-600">Clean Rate</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">
                  {Math.round((history.duplicateCount / history.totalRecords) * 100)}%
                </p>
                <p className="text-sm text-gray-600">Duplicate Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Preview */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Preview of Cleaned Data</h2>
          <HiClipboardList className="w-5 h-5 text-gray-400" />
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
          {previewData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.01 }}
              className="py-3 px-4 mb-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <code className="font-mono text-sm text-gray-800">{item}</code>
                <span className="text-xs text-gray-500">#{index + 1}</span>
              </div>
            </motion.div>
          ))}
          {history.purifiedData.length > 20 && (
            <p className="text-center text-gray-500 py-4">
              ... and {history.purifiedData.length - 20} more records
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default HistoryDetail;