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
        <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-300">Upload Image</h2>
            <input type="file" onChange={handleFileChange} />
            <button
                onClick={handleUpload}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                disabled={loading}
            >
                {loading ? 'Uploading...' : 'Upload'}
            </button>
        </div>
    );
};

export default ImageUpload;
