import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

interface Image {
  image_url: string;
  filename: string;
  uploaded_at: string;
}

const ImageGallery: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/images/list', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authContext?.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }

        const data: Image[] = await response.json();
        authContext?.addImages(data);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setLoading(false);
      }
    };

    if (authContext?.token && authContext?.images.length === 0) {
      fetchImages();
    }
  }, [authContext?.token, authContext]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-blue-300">Image Gallery</h2>
      {loading && <div className="loader">Loading...</div>}
      <div className="grid grid-cols-3 gap-4">
        {authContext?.images.map((image, index) => (
          <img
            key={index}
            src={image.image_url}
            alt={`Image ${index}`}
            className="w-full h-auto rounded shadow-md transition-transform transform hover:scale-105"
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
