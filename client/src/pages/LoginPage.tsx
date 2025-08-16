import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { LOGIN_MUTATION } from '../graphql/queries';
import { setAuthToken } from '../graphql/client';
import type { LoginInput, AuthResponse } from '../types';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginInput>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [login, { loading }] = useMutation<{ login: AuthResponse }>(LOGIN_MUTATION, {
    onCompleted: (data) => {
      setAuthToken(data.login.accessToken);
      localStorage.setItem('refresh_token', data.login.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.login.user));
      navigate('/');
    },
    onError: (error) => {
      console.error('Login error:', error);
      setErrors({ general: 'Email o contraseña incorrectos' });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validación simple
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = 'El email es requerido';
    if (!formData.password) newErrors.password = 'La contraseña es requerida';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await login({
        variables: {
          input: formData,
        },
      });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleChange = (field: keyof LoginInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-sm sm:max-w-md w-full space-y-6 sm:space-y-8">
        {/* 🎯 Header */}
        <div className="text-center">
          <div className="mx-auto h-14 w-14 sm:h-16 sm:w-16 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-xl sm:text-2xl">⚽</span>
          </div>
          <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold text-gray-900">
            Fútbol Stats App
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-600">
            Inicia sesión para acceder a tus estadísticas
          </p>
        </div>

        {/* 📝 Form */}
        <form className="mt-6 sm:mt-8 space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-sm">
              {errors.general}
            </div>
          )}

          <div className="space-y-4">
            {/* 📧 Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="tu@email.com"
                disabled={loading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* 🔐 Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className={`w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="••••••••"
                disabled={loading}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          {/* 🚀 Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 sm:py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-sm"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Iniciando sesión...
              </div>
            ) : (
              'Iniciar Sesión'
            )}
          </button>

          {/* 📋 Demo Credentials */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-100 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              <strong>Demo:</strong> williner.martin@gmail.com / Wert1234!
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
