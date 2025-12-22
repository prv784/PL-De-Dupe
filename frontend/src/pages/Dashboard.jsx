import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dedupeAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  HiDocumentText, 
  HiOutlineDocumentDuplicate, 
  HiCheckCircle,
  HiArrowUp,
  HiUpload,
  HiClock,
  HiSparkles,
  HiTrendingUp,
  HiUsers,
  HiChartBar
} from 'react-icons/hi';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalRecords: 0,
    totalDuplicates: 0,
    avgDuplicatePercentage: 0
  });
  const [recentHistory, setRecentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, historyRes] = await Promise.all([
        dedupeAPI.getStatistics(),
        dedupeAPI.getHistory({ limit: 5 })
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
      if (historyRes.data.success) {
        setRecentHistory(historyRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Don't show toast for stats errors
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
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

  // Sample data for charts (you can replace with real data)
  const efficiencyData = [
    { name: 'Mon', efficiency: 85 },
    { name: 'Tue', efficiency: 92 },
    { name: 'Wed', efficiency: 78 },
    { name: 'Thu', efficiency: 95 },
    { name: 'Fri', efficiency: 88 },
    { name: 'Sat', efficiency: 96 },
    { name: 'Sun', efficiency: 90 }
  ];

  const fileTypeData = [
    { name: 'CSV', value: 45 },
    { name: 'Excel', value: 35 },
    { name: 'JSON', value: 15 },
    { name: 'Manual', value: 5 }
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

  return (
    <motion.div 
      className="p-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Welcome back, {user?.name}!</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage and de-duplicate your price lists efficiently</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/upload"
              className="btn-primary flex items-center gap-2 px-6 py-3"
            >
              <HiSparkles className="w-5 h-5" />
              Start De-duplication
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div 
          whileHover={{ y: -5 }}
          className="card hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Files Processed</p>
              <p className="text-2xl font-bold mt-2 dark:text-gray-200">{stats.totalFiles || 0}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
              <HiDocumentText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="card hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Records</p>
              <p className="text-2xl font-bold mt-2 dark:text-gray-200">{(stats.totalRecords || 0).toLocaleString()}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
              <HiOutlineDocumentDuplicate className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="card hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Duplicates Removed</p>
              <p className="text-2xl font-bold mt-2 dark:text-gray-200">{(stats.totalDuplicates || 0).toLocaleString()}</p>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
              <HiCheckCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="card hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg Efficiency</p>
              <p className="text-2xl font-bold mt-2 dark:text-gray-200">{stats.avgDuplicatePercentage ? stats.avgDuplicatePercentage.toFixed(1) : '0.0'}%</p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg">
              <HiTrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Activity Chart */}
        <motion.div variants={itemVariants} className="card">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-gray-200">
            <HiChartBar className="w-5 h-5 text-primary" />
            Processing Efficiency
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={efficiencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="efficiency" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* File Types Distribution */}
        <motion.div variants={itemVariants} className="card">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-gray-200">
            <HiUsers className="w-5 h-5 text-primary" />
            File Type Distribution
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fileTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {fileTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="card">
          <h2 className="text-xl font-bold mb-4 dark:text-gray-200">Quick Actions</h2>
          <div className="space-y-4">
            <motion.div whileHover={{ scale: 1.02 }}>
              <Link
                to="/upload"
                className="flex items-center p-4 bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <HiUpload className="w-5 h-5 mr-3" />
                <div>
                  <p className="font-medium">De-duplicate File</p>
                  <p className="text-sm opacity-90">Upload CSV, Excel, or JSON file</p>
                </div>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Link
                to="/history"
                className="flex items-center p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                <HiClock className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
                <div>
                  <p className="font-medium dark:text-gray-200">View History</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Check past de-duplications</p>
                </div>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants} className="card">
          <h2 className="text-xl font-bold mb-4 dark:text-gray-200">Recent Activity</h2>
          <div className="space-y-4">
            {recentHistory.length > 0 ? (
              recentHistory.map((item) => (
                <motion.div 
                  key={item._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors dark:hover:bg-gray-700"
                >
                  <div>
                    <p className="font-medium truncate max-w-[200px] dark:text-gray-200">{item.originalFilename}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.uniqueRecords} unique • {item.duplicateCount} duplicates
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {item.processedAt ? new Date(item.processedAt).toLocaleDateString() : 'N/A'}
                  </span>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <HiOutlineDocumentDuplicate className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Start by uploading your first file</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;