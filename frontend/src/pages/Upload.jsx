import React, { useState } from 'react';
import { dedupeAPI } from '../services/api';
import { saveAs } from 'file-saver';
import { 
  HiUpload, 
  HiDocumentText, 
  HiCheckCircle, 
  HiXCircle,
  HiDownload,
  HiClipboardList
} from 'react-icons/hi';

import * as XLSX from 'xlsx';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [manualInput, setManualInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [previewData, setPreviewData] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setManualInput('');
      previewFile(selectedFile);
    }
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      let data = [];
      
      if (file.name.endsWith('.csv')) {
        data = content.split('\n').slice(0, 10).map(line => line.trim()).filter(line => line);
      } else if (file.name.endsWith('.json')) {
        try {
          const jsonData = JSON.parse(content);
          data = Array.isArray(jsonData) 
            ? jsonData.slice(0, 10).map(item => String(item))
            : [JSON.stringify(jsonData)];
        } catch {
          data = ['Unable to preview JSON'];
        }
      }
      
      setPreviewData(data);
    };
    
    if (file.name.endsWith('.csv') || file.name.endsWith('.json')) {
      reader.readAsText(file);
    } else {
      setPreviewData(['Preview available for CSV and JSON files only']);
    }
  };

  const handleManualInputChange = (e) => {
    setManualInput(e.target.value);
    if (e.target.value) {
      setFile(null);
      const lines = e.target.value.split('\n').slice(0, 10);
      setPreviewData(lines.filter(line => line.trim()));
    } else {
      setPreviewData([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file && !manualInput.trim()) {
      setError('Please upload a file or enter PL numbers manually');
      return;
    }

    setIsProcessing(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      } else {
        formData.append('manualInput', manualInput);
      }

      const response = await dedupeAPI.process(formData);
      
      if (response.data.success) {
        setResult(response.data.data);
      } else {
        setError(response.data.message || 'Processing failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during processing');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async (format) => {
    if (!result?.historyId) {
      setError('No history ID available for download');
      return;
    }

    try {
      const response = await dedupeAPI.download(result.historyId, format);
      
      // Get filename from content-disposition header
      const contentDisposition = response.headers['content-disposition'];
      let filename = `de-duplicated.${format}`;
      
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) filename = match[1];
      }

      // Create blob and download
      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] 
      });
      saveAs(blob, filename);
    } catch (err) {
      setError('Error downloading file: ' + (err.response?.data?.message || err.message));
    }
  };

  // Alternative: Create CSV file locally without API call
  const handleDownloadLocalCSV = () => {
    if (!result?.uniqueData) return;
    
    const csvContent = result.uniqueData.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `de-duplicated-${Date.now()}.csv`);
  };

  // Alternative: Create JSON file locally without API call
  const handleDownloadLocalJSON = () => {
    if (!result?.uniqueData) return;
    
    const jsonContent = JSON.stringify(result.uniqueData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    saveAs(blob, `de-duplicated-${Date.now()}.json`);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">De-duplicate Price Lists</h1>
        <p className="text-gray-600 mt-2">Upload files or enter PL numbers to remove duplicates</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="card">
          <h2 className="text-xl font-bold mb-6">Upload File or Enter Data</h2>
          
          <form onSubmit={handleSubmit}>
            {/* File Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose File (CSV, Excel, JSON)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                <HiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drag & drop your file here or click to browse</p>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".csv,.xlsx,.xls,.json"
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="btn-primary inline-block cursor-pointer px-6 py-2"
                >
                  Choose File
                </label>
                {file && (
                  <p className="mt-4 text-sm text-gray-600">
                    Selected: <span className="font-medium">{file.name}</span>
                  </p>
                )}
              </div>
            </div>

            {/* OR Divider */}
            <div className="flex items-center mb-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Manual Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <HiClipboardList className="inline w-4 h-4 mr-2" />
                Enter PL Numbers Manually (one per line)
              </label>
              <textarea
                value={manualInput}
                onChange={handleManualInputChange}
                rows="6"
                className="input-field"
                placeholder="PL-001
PL-002
PL-003
PL-001 (duplicate)
PL-004"
              />
            </div>

            {/* Preview */}
            {previewData.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Preview (first 10 entries)</h3>
                <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                  {previewData.map((item, index) => (
                    <div key={index} className="text-sm text-gray-600 py-1 border-b border-gray-200 last:border-0">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 flex items-center">
                  <HiXCircle className="w-5 h-5 mr-2" />
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing || (!file && !manualInput.trim())}
              className="btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </span>
              ) : (
                'De-duplicate Now'
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div className="card">
          <h2 className="text-xl font-bold mb-6">De-duplication Results</h2>
          
          {result ? (
            <div className="animate-fade-in">
              {/* Result Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-600">{result.originalCount}</p>
                  <p className="text-sm text-gray-600 mt-1">Total Records</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">{result.uniqueCount}</p>
                  <p className="text-sm text-gray-600 mt-1">Unique Records</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-red-600">{result.duplicateCount}</p>
                  <p className="text-sm text-gray-600 mt-1">Duplicates Removed</p>
                </div>
              </div>

              {/* Success Message */}
              <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <HiCheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <div>
                    <p className="font-medium text-green-800">
                      Successfully removed {result.duplicateCount} duplicate{result.duplicateCount !== 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      Duplicate rate: {result.duplicatePercentage}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Download Options */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Download Cleaned Data</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleDownload('csv')}
                    className="flex-1 flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <HiDownload className="w-5 h-5 mr-2" />
                    CSV (via API)
                  </button>
                  <button
                    onClick={handleDownloadLocalCSV}
                    className="flex-1 flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <HiDownload className="w-5 h-5 mr-2" />
                    CSV (Local)
                  </button>
                  <button
                    onClick={handleDownloadLocalJSON}
                    className="flex-1 flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <HiDownload className="w-5 h-5 mr-2" />
                    JSON (Local)
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Note: Excel download requires backend API connection
                </p>
              </div>

              {/* Preview of Cleaned Data */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">Preview of Cleaned Data</h3>
                <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                  {result.uniqueData.slice(0, 20).map((item, index) => (
                    <div key={index} className="text-sm text-gray-600 py-2 border-b border-gray-200 last:border-0">
                      <span className="font-mono">{item}</span>
                    </div>
                  ))}
                  {result.uniqueData.length > 20 && (
                    <p className="text-sm text-gray-500 text-center py-2">
                      ... and {result.originalCount - 20} more records
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <HiDocumentText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Upload a file or enter data to see de-duplication results</p>
              <p className="text-sm text-gray-400 mt-2">Results will appear here after processing</p>
            </div>
          )}
        </div>
      </div>

      {/* Supported Formats */}
      <div className="card mt-8">
        <h2 className="text-xl font-bold mb-6">Supported Formats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl mb-2">📄</div>
            <h3 className="font-bold mb-2">CSV Files</h3>
            <p className="text-gray-600">Comma-separated values with PL numbers</p>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-bold mb-2">Excel Files</h3>
            <p className="text-gray-600">XLSX or XLS format with PL numbers</p>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl mb-2">🔤</div>
            <h3 className="font-bold mb-2">JSON Files</h3>
            <p className="text-gray-600">JSON arrays or objects containing PL numbers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;