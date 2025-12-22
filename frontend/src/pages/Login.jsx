import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HiMail, 
  HiKey, 
  HiDocumentDuplicate, 
  HiEye, 
  HiEyeOff,
  HiOutlineExclamationCircle 
} from 'react-icons/hi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setError(Object.values(errors)[0]);
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result?.success) {
        // Add success animation before navigation
        const form = e.target;
        form.classList.add('success');
        setTimeout(() => navigate('/dashboard'), 500);
      } else {
        setError(result?.message || 'Invalid email or password');
        // Shake animation on error
        const form = e.target;
        form.classList.add('shake');
        setTimeout(() => form.classList.remove('shake'), 500);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const errors = validateForm();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-primary/5 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl mb-5 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <HiDocumentDuplicate className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-primary bg-clip-text text-transparent">
            PL De-Dupe
          </h1>
          <p className="text-gray-600 mt-2 text-sm">
            Sign in to de-duplicate your price lists
          </p>
        </div>

        {/* Login Card */}
        <div className="card shadow-2xl border border-gray-100 hover:shadow-primary/10 transition-shadow duration-300">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              Welcome Back
            </h2>
            <p className="text-gray-500 text-sm text-center mt-2">
              Enter your credentials to continue
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-slide-down flex items-start gap-3">
              <HiOutlineExclamationCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                  <HiMail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (isSubmitted) setError('');
                  }}
                  placeholder="you@example.com"
                  className={`input-field pl-12 pr-4 ${errors.email && isSubmitted ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
                  required
                  disabled={loading}
                />
                {errors.email && isSubmitted && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <HiOutlineExclamationCircle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary hover:text-primary/80 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                  <HiKey className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (isSubmitted) setError('');
                  }}
                  placeholder="Enter your password"
                  className={`input-field pl-12 pr-12 ${errors.password && isSubmitted ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                  tabIndex="-1"
                >
                  {showPassword ? (
                    <HiEyeOff className="w-5 h-5" />
                  ) : (
                    <HiEye className="w-5 h-5" />
                  )}
                </button>
                {errors.password && isSubmitted && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <HiOutlineExclamationCircle className="w-3 h-3" />
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary/50"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                Remember me
              </label>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Register */}
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-primary font-semibold hover:text-primary/80 hover:underline transition-all"
              >
                Create one now
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} PL De-Dupe. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

// Add these CSS animations to your global styles or component styles
const styles = `
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-down {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}

.animate-slide-down {
  animation: slide-down 0.3s ease-out;
}

.shake {
  animation: shake 0.5s ease-in-out;
}

.success {
  animation: fade-in 0.3s ease-out;
}

.input-field {
  @apply w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-white;
}

.btn-primary {
  @apply bg-primary text-white font-medium rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2;
}

.card {
  @apply bg-white rounded-2xl p-8 backdrop-blur-sm;
}
`;

// Add this to your global stylesheet or component
export default Login;