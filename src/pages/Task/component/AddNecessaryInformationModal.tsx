import React, { useState } from 'react';
import HeadingTwo from '../../../new-components/ui/heading/HeadingTwo';

interface AddNecessaryInformationModalProps {
  closeModal: () => void;
  onAdd: (data: { platform: string; url: string; email: string; password: string }) => void;
}

const platformOptions = [
  'Google',
  'Facebook',
  'Instagram',
  'Snapchat',
  'Twitter',
  'LinkedIn',
];

const AddNecessaryInformationModal: React.FC<AddNecessaryInformationModalProps> = ({ closeModal, onAdd }) => {
  const [formData, setFormData] = useState({
    platform: '',
    url: '',
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.platform && formData.url && formData.email && formData.password) {
      onAdd(formData);
      closeModal();
      // Reset form
      setFormData({
        platform: '',
        url: '',
        email: '',
        password: '',
      });
    }
  };

  return (
    <div className="w-full max-h-[80vh] flex flex-col">
      <div className="flex-shrink-0 mb-4">
        <HeadingTwo text="Add Necessary Information" />
      </div>

      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#737791] dark:text-white mb-2">
              Platform
            </label>
            <select
              name="platform"
              value={formData.platform}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select Platform</option>
              {platformOptions.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#737791] dark:text-white mb-2">
              URL
            </label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder="Enter URL"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#737791] dark:text-white mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#737791] dark:text-white mb-2">
              Password
            </label>
            <input
              type="text"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder="Enter password"
            />
          </div>
        </form>
      </div>

      <div className="flex-shrink-0 flex justify-end gap-3 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          className='w-[50%] px-5 py-3.5 text-sm inline-flex font-medium items-center justify-center gap-2 rounded-lg transition bg-white border-[1px] text-[#5D5FEF] ring-1 ring-inset ring-gray-300 dark:bg-[#0D0D0D] dark:text-[#A9A9CD] dark:ring-gray-700/50'
          onClick={closeModal}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-[#5D5FEF] hover:bg-[#4a4cd1] text-white w-[50%] px-5 py-3.5 text-sm inline-flex font-medium items-center justify-center gap-2 rounded-lg transition"
        >
          Add Information
        </button>
      </div>
    </div>
  );
};

export default AddNecessaryInformationModal;

