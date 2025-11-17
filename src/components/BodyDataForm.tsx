'use client';

import { useState, useEffect } from 'react';
import { BodyData } from '@/types';

interface BodyDataFormProps {
  initialData: BodyData | null;
  onChange: (data: BodyData | null) => void;
}

export function BodyDataForm({ initialData, onChange }: BodyDataFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState<BodyData>({
    height: initialData?.height || '',
    weight: initialData?.weight || '',
    bodyType: initialData?.bodyType || undefined,
    gender: initialData?.gender || undefined,
    age: initialData?.age || '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setIsExpanded(true);
    }
  }, [initialData]);

  const handleChange = (field: keyof BodyData, value: string) => {
    const newData = { ...formData, [field]: value || undefined };
    setFormData(newData);
    onChange(newData);
  };

  const handleClear = () => {
    const emptyData: BodyData = {};
    setFormData(emptyData);
    onChange(null);
  };

  const hasData = Object.values(formData).some(v => v);

  return (
    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Body Data (Optional)
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Add your measurements for more accurate AI results
          </p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
        >
          {isExpanded ? 'Hide' : 'Show'}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Height
              </label>
              <input
                type="text"
                value={formData.height || ''}
                onChange={(e) => handleChange('height', e.target.value)}
                placeholder="e.g., 5'10\" or 178cm"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Weight
              </label>
              <input
                type="text"
                value={formData.weight || ''}
                onChange={(e) => handleChange('weight', e.target.value)}
                placeholder="e.g., 150 lbs or 68 kg"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Body Type
              </label>
              <select
                value={formData.bodyType || ''}
                onChange={(e) => handleChange('bodyType', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select...</option>
                <option value="slim">Slim</option>
                <option value="average">Average</option>
                <option value="athletic">Athletic</option>
                <option value="plus-size">Plus Size</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Gender
              </label>
              <select
                value={formData.gender || ''}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Age
              </label>
              <input
                type="text"
                value={formData.age || ''}
                onChange={(e) => handleChange('age', e.target.value)}
                placeholder="e.g., 25"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {hasData && (
            <div className="flex justify-end">
              <button
                onClick={handleClear}
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
              >
                Clear All Data
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}