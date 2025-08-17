import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { Shield, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface OTPFormData {
  otp: string;
}

const OTPVerification: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const UID = location.state?.UID;

  const { register, handleSubmit } = useForm<OTPFormData>();

  const onSubmit = async (data: OTPFormData) => {
    if (!UID) {
      toast.error('UID not found. Please go back and try again.');
      return;
    }

    setLoading(true);
    try {
      await authService.verifyOTP({ UID, otp: data.otp });
      toast.success('Email verified successfully! You can now log in.');
      navigate('/login');
    } catch (error) {
      toast.error('Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!UID) return;

    setResending(true);
    try {
      await authService.resendOTP({ UID });
      toast.success('New OTP sent to your email');
    } catch (error) {
      toast.error('Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  if (!UID) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Invalid access. Please start from signup.</p>
          <button
            onClick={() => navigate('/signup')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Go to Signup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-indigo-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 bg-red-600 rounded-xl flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Verify Your Email</h1>
          <p className="text-gray-600 mt-2">
            We've sent a 6-digit code to{' '}
            <span className="font-medium">{UID.toLowerCase()}@cuchd.in</span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </label>
            <input
              {...register('otp', { required: true })}
              type="text"
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              className="w-full px-4 py-3 text-center text-2xl font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-4">Didn't receive the code?</p>
          <button
            onClick={handleResendOTP}
            disabled={resending}
            className="inline-flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium"
          >
            <RefreshCw className={`h-4 w-4 ${resending ? 'animate-spin' : ''}`} />
            <span>{resending ? 'Resending...' : 'Resend OTP'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;