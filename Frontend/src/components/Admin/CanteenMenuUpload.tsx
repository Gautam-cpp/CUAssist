import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { canteenService } from '../../services/canteenService';
import { ArrowLeft, Upload, UtensilsCrossed } from 'lucide-react';
import toast from 'react-hot-toast';

const canteens = ['Zakir-A', 'Zakir-B', 'Zakir-C', 'Zakir-D', 'NC1', 'NC2', 'NC3', 'NC4', 'NC5', 'NC6'];

const CanteenMenuUpload: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const selectedFile = watch('image')?.[0];

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('canteenName', data.canteenName);
      formData.append('image', data.image[0]);

      await canteenService.uploadMenu(formData);
      toast.success('Menu uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload menu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          to="/admin"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Upload Canteen Menu</h1>
      </div>

      <div className="bg-orange-50 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <UtensilsCrossed className="h-6 w-6 text-orange-600 mt-1" />
          <div>
            <h3 className="font-semibold text-orange-900">Menu Upload Guidelines</h3>
            <ul className="text-sm text-orange-800 mt-2 space-y-1">
              <li>• Upload clear, high-quality images of the menu</li>
              <li>• Supported formats: JPEG, PNG</li>
              <li>• Maximum file size: 5MB</li>
              <li>• Existing menus will be replaced with new uploads</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Canteen Name *
            </label>
            <select
              {...register('canteenName', { required: 'Please select a canteen' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Select Canteen</option>
              {canteens.map((canteen) => (
                <option key={canteen} value={canteen}>
                  {canteen}
                </option>
              ))}
            </select>
            {errors.canteenName && (
              <p className="mt-1 text-sm text-red-600">{errors.canteenName.message as string}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Menu Image *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors">
              <input
                {...register('image', {
                  required: 'Menu image is required',
                  validate: {
                    fileType: (files) => {
                      if (!files[0]) return true;
                      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
                      return validTypes.includes(files[0].type) || 'Only JPEG, PNG images are allowed';
                    },
                    fileSize: (files) => {
                      if (!files[0]) return true;
                      return files[0].size <= 5 * 1024 * 1024 || 'File size must be less than 5MB';
                    },
                  },
                })}
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {selectedFile ? selectedFile.name : 'Click to upload menu image'}
                </p>
                <p className="text-sm text-gray-500">
                  JPEG, PNG up to 5MB
                </p>
              </label>
            </div>
            {errors.image && (
              <p className="mt-1 text-sm text-red-600">{errors.image.message as string}</p>
            )}
          </div>

          <div className="flex space-x-4">
            <Link
              to="/admin"
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Upload Menu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CanteenMenuUpload;