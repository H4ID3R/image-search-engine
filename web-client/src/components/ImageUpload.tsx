import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const ImageUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const authContext = useContext(AuthContext);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/images/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authContext?.token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      authContext?.addImages([data]); 
      setFile(null);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 space-y-4">
        <h2 className="text-2xl font-bold text-blue-300">Upload Image</h2>
        <div className="flex items-center space-x-4">
            <label 
                htmlFor="file-upload" 
                className="bg-white hover:bg-gray-300 text-black font-bold py-2 px-4 rounded cursor-pointer mr-20"
            >
                {file ? file.name : 'Choose File'}
            </label>
            <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                className="hidden"
            />
            <button
                onClick={handleUpload}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={loading}
            >
                {loading ? 'Uploading...' : 'Upload'}
            </button>
        </div>
    </div>
);

};

export default ImageUpload;
