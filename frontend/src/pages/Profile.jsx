import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  HiUser,
  HiKey,
  HiLogout,
  HiPencil,
  HiSave,
  HiX,
  HiCheckCircle,
  HiMail,
  HiLockClosed,
  HiShieldCheck,
  HiChevronRight,
  HiExclamationCircle
} from 'react-icons/hi';

const Profile = () => {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);

  const [profileData, setProfileData] = useState({ name: '', email: '' });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name, email: user.email });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const res = await updateProfile(profileData);
    if (res?.success) {
      toast.success('Profile updated');
      setEditMode(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    const res = await changePassword(
      passwordData.currentPassword,
      passwordData.newPassword
    );
    if (res?.success) toast.success('Password updated');
  };

  // Modern gradient background
  const gradientBg = "bg-gradient-to-br from-gray-50 via-white to-blue-50";

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`pt-16 lg:pt-0 p-4 lg:p-8 min-h-screen ${gradientBg}`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Modern Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Account Settings
          </h1>
          <p className="text-gray-500 mt-2">Manage your profile and security settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Modern Sidebar - Responsive */}
          <div className="lg:col-span-1">
            {/* Mobile tabs selector */}
            <div className="lg:hidden mb-6">
              <div className="flex rounded-lg bg-white p-1 shadow-sm border">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex-1 py-3 px-4 rounded-md transition-all duration-200 ${
                    activeTab === 'profile' 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <HiUser className="inline mr-2" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`flex-1 py-3 px-4 rounded-md transition-all duration-200 ${
                    activeTab === 'security' 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <HiKey className="inline mr-2" />
                  Security
                </button>
              </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:block space-y-4">
              {/* User Card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl flex items-center justify-center mx-auto text-3xl font-bold mb-4 shadow-lg">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border-4 border-white">
                    <HiCheckCircle className="text-white text-lg" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-center mt-6">{user?.name}</h2>
                <p className="text-gray-500 text-center text-sm mt-1">{user?.email}</p>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-center text-sm text-gray-600 bg-gray-50 py-2 rounded-lg">
                    <HiShieldCheck className="mr-2 text-green-500" />
                    Verified Account
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                      activeTab === 'profile'
                      ? 'bg-blue-50 text-blue-600 border border-blue-100'
                      : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg mr-3 ${
                        activeTab === 'profile' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <HiUser />
                      </div>
                      <span className="font-medium">Profile</span>
                    </div>
                    <HiChevronRight className={`transition-transform ${
                      activeTab === 'profile' ? 'text-blue-500' : 'text-gray-400'
                    }`} />
                  </button>

                  <button
                    onClick={() => setActiveTab('security')}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                      activeTab === 'security'
                      ? 'bg-blue-50 text-blue-600 border border-blue-100'
                      : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg mr-3 ${
                        activeTab === 'security' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <HiKey />
                      </div>
                      <span className="font-medium">Security</span>
                    </div>
                    <HiChevronRight className={`transition-transform ${
                      activeTab === 'security' ? 'text-blue-500' : 'text-gray-400'
                    }`} />
                  </button>
                </nav>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="w-full mt-6 flex items-center justify-center p-4 text-red-600 hover:bg-red-50 rounded-xl border border-red-100 transition-all duration-200 group"
                >
                  <HiLogout className="mr-3 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' ? (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              >
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Personal Information</h2>
                      <p className="text-blue-100 mt-1">Update your profile details</p>
                    </div>
                    {!editMode && (
                      <button 
                        onClick={() => setEditMode(true)}
                        className="bg-white text-blue-600 hover:bg-blue-50 px-5 py-2.5 rounded-xl font-medium flex items-center shadow-lg transition-all duration-200 hover:scale-105"
                      >
                        <HiPencil className="mr-2" />
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>

                {/* Form Content */}
                <div className="p-8">
                  {editMode ? (
                    <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-2xl">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                          </label>
                          <div className="relative">
                            <HiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                              value={profileData.name}
                              onChange={(e) =>
                                setProfileData({ ...profileData, name: e.target.value })
                              }
                              placeholder="Enter your name"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <div className="relative">
                            <HiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                              value={profileData.email}
                              onChange={(e) =>
                                setProfileData({ ...profileData, email: e.target.value })
                              }
                              placeholder="Enter your email"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button 
                          type="submit" 
                          className="btn-primary bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium flex items-center transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          <HiSave className="mr-2" />
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditMode(false)}
                          className="px-6 py-3 rounded-xl font-medium border border-gray-300 hover:bg-gray-50 text-gray-700 transition-all duration-200 flex items-center"
                        >
                          <HiX className="mr-2" />
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="max-w-2xl">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-sm text-gray-500 mb-1">Full Name</p>
                            <p className="text-lg font-semibold">{user?.name}</p>
                          </div>
                          <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-sm text-gray-500 mb-1">Email Address</p>
                            <p className="text-lg font-semibold">{user?.email}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-6">
                          <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                            <div className="flex items-center mb-3">
                              <div className="p-2 bg-green-100 rounded-lg mr-3">
                                <HiCheckCircle className="text-green-600 text-xl" />
                              </div>
                              <h3 className="font-semibold text-gray-800">Account Status</h3>
                            </div>
                            <p className="text-gray-600 text-sm">Your account is active and verified</p>
                            <div className="mt-4 inline-flex items-center text-sm font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                              Active
                            </div>
                          </div>
                          
                          <div className="p-5 bg-amber-50 rounded-xl border border-amber-100">
                            <div className="flex items-center">
                              <HiExclamationCircle className="text-amber-500 mr-3 text-xl" />
                              <div>
                                <p className="font-medium text-gray-800">Last Updated</p>
                                <p className="text-sm text-gray-600">Recently active</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              /* Security Tab */
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              >
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-8 py-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Security Settings</h2>
                      <p className="text-purple-100 mt-1">Manage your password and security</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-xl">
                      <HiShieldCheck className="text-white text-2xl" />
                    </div>
                  </div>
                </div>

                {/* Form Content */}
                <div className="p-8">
                  <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-2xl">
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <HiLockClosed className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="password"
                            placeholder="Enter current password"
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                            onChange={(e) =>
                              setPasswordData({ ...passwordData, currentPassword: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <div className="relative">
                            <HiKey className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="password"
                              placeholder="Enter new password"
                              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                              onChange={(e) =>
                                setPasswordData({ ...passwordData, newPassword: e.target.value })
                              }
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password
                          </label>
                          <div className="relative">
                            <HiLockClosed className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="password"
                              placeholder="Confirm new password"
                              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                              onChange={(e) =>
                                setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Password Requirements */}
                    <div className="p-5 bg-blue-50 rounded-xl border border-blue-100">
                      <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                        <HiKey className="mr-2 text-blue-500" />
                        Password Requirements
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-2"></span>
                          Minimum 8 characters
                        </li>
                        <li className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-2"></span>
                          Include uppercase & lowercase letters
                        </li>
                        <li className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-2"></span>
                          At least one number or special character
                        </li>
                      </ul>
                    </div>

                    <button 
                      type="submit" 
                      className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-7 py-3.5 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Update Password
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;