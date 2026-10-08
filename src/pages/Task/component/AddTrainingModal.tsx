import React, { useState } from 'react';
import Button from '../../../new-components/ui/button/Button';
import HeadingTwo from '../../../new-components/ui/heading/HeadingTwo';

interface AddTrainingModalProps {
  closeModal: () => void;
}

const AddTrainingModal: React.FC<AddTrainingModalProps> = ({ closeModal }) => {
  const [formData, setFormData] = useState({
    title: '',
    label: 'Basic',
    duration: '',
    type: 'video',
    thumbnail: '',
    avatar: '',
    url: '',
    notes: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const url = URL.createObjectURL(files[0]);
      setFormData(prev => ({ ...prev, [name]: url }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    closeModal();
  };

  return (
    <div className="w-full max-h-[80vh] flex flex-col">
      <div className="flex-shrink-0 mb-4">
        <HeadingTwo text="Add New Training" />
      </div>

      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#6E7A86] dark:text-white mb-2">
              Training Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder="Enter training name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#6E7A86] dark:text-white mb-2">
              Training Type
            </label>
            <select
              name="label"
              value={formData.label}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="Basic">Basic</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advance">Advance</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#6E7A86] dark:text-white mb-2">
              Training Time
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              required
              pattern="^\d{2}:\d{2}:\d{2}$"
              className="w-full px-3 py-2 border bg-[#6E7A8640]/25 border-gray-300 rounded-md focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder="00:00:00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#6E7A86] dark:text-white mb-2">
              Training Asset Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="video">Video</option>
              <option value="pdf">PDF</option>
            </select>
          </div>

          {formData.type === 'video' && (
            <div>
              <label className="block text-sm font-medium text-[#6E7A86] dark:text-white mb-2">
                Upload Video
              </label>
              <input
                type="file"
                name="thumbnail"
                onChange={handleFileChange}
                accept="video/*"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#6E7A86] dark:text-white mb-2">
              URL
            </label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder="Enter or paste URL"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#6E7A86] dark:text-white mb-2">
              Notes <span className="text-red-500">*</span>
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white resize-none"
              placeholder="Enter relevant details"
            />
          </div>
        </form>
      </div>

      <div className="flex-shrink-0 flex justify-end gap-3 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          className='w-[50%] px-5 py-3.5 text-sm inline-flex font-medium items-center justify-center gap-2 rounded-lg transition bg-white border-[1px] text-[#0088D1] ring-1 ring-inset ring-gray-300 dark:bg-[#0D0D0D] dark:text-[#A9BACB] dark:ring-gray-700/50'
          onClick={closeModal}
        >
          Cancel
        </button>
        <Button
          className="bg-[#0088D1] hover:bg-[#4a4cd1] text-white w-[50%]"
        >
          Add Training
        </Button>
      </div>
    </div>
  );
};

export default AddTrainingModal;