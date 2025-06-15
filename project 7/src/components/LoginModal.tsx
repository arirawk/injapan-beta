import React, { useState } from 'react';
import { X, User, Lock, Eye, EyeOff, Mail, Crown } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
}

// Email admin yang memiliki akses penuh (disembunyikan dari tampilan)
const ADMIN_EMAILS = [
  "admin@injapan.food",
  "wahyuari29@gmail.com",
  "owner@injapan.food"
];

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isAdminEmail = (email: string) => ADMIN_EMAILS.includes(email.toLowerCase());

  const getErrorMessage = (error: any) => {
    if (error.message?.includes('Invalid login credentials')) {
      return 'Email atau password salah. Silakan periksa kembali kredensial Anda.';
    }
    if (error.message?.includes('Email not confirmed')) {
      return 'Email belum diverifikasi. Silakan cek email Anda untuk link verifikasi.';
    }
    if (error.message?.includes('User already registered')) {
      return 'Email sudah terdaftar. Silakan gunakan email lain atau masuk dengan akun yang ada.';
    }
    if (error.message?.includes('Password should be at least')) {
      return 'Password harus minimal 6 karakter.';
    }
    if (error.message?.includes('Unable to validate email address')) {
      return 'Format email tidak valid. Silakan masukkan email yang benar.';
    }
    return error.message || 'Terjadi kesalahan. Silakan coba lagi.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        if (data.user) {
          onLoginSuccess(data.user);
          onClose();
          resetForm();
        }
      } else {
        // Register
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name,
            }
          }
        });

        if (error) throw error;
        
        if (data.user) {
          setError('Akun berhasil dibuat! Silakan cek email Anda untuk verifikasi akun.');
          setTimeout(() => {
            setIsLogin(true);
            setError('');
          }, 3000);
        }
      }
    } catch (error: any) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setError('');
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleModeSwitch = () => {
    setIsLogin(!isLogin);
    setError('');
    // Don't reset form fields to maintain user input
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {isLogin ? 'Masuk' : 'Daftar'}
            </h2>
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={handleClose}
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {/* Admin Info - hanya muncul jika email admin diketik */}
          {email && isAdminEmail(email) && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center space-x-2 text-green-700">
                <Crown className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Email admin terdeteksi - Akses penuh akan diaktifkan setelah login
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="Nama Lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                required
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                  email && isAdminEmail(email) 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-gray-300'
                }`}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {email && isAdminEmail(email) && (
                <Crown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-600" />
              )}
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="Password (minimal 6 karakter)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>

            {error && (
              <div className={`p-3 rounded-xl text-sm ${
                error.includes('berhasil') || error.includes('cek email') 
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-xl py-3 font-semibold text-center transition-all ${
                loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : email && isAdminEmail(email)
                  ? "bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl"
                  : "bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl"
              }`}
            >
              {loading ? 'Memproses...' : (isLogin ? 'Masuk' : 'Daftar')}
              {email && isAdminEmail(email) && !loading && (
                <span className="ml-2">👑</span>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
              <button
                className="ml-2 text-red-600 font-semibold hover:text-red-700 transition-colors"
                onClick={handleModeSwitch}
              >
                {isLogin ? 'Daftar' : 'Masuk'}
              </button>
            </p>
          </div>

          {/* Info umum tanpa menampilkan email admin */}
          <div className="mt-6 p-3 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-600 text-center">
              <br/>
              
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}