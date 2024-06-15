import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ImageSearch: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    

    useEffect(() => {
        if (!authContext?.loading && !authContext?.token) {
            navigate('/');
        }
    }, [authContext?.token, authContext?.loading, navigate]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files?.[0] || null);
    };

    const handleSearch = async () => {
        if (!file) return;

        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/images/search', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authContext?.token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to search images');
            }

            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error('Error searching images:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authContext?.logout();
        navigate('/');
    };

    const handleDashboardPage = () => {
        navigate('/dashboard');
    };

    return (
        <div className="flex flex-col items-center min-h-screen p-4 bg-black text-white">
            <div className="w-full max-w-6xl mb-24">
                <div className="flex justify-between items-center mb-24">
                    <h1 className="text-3xl font-bold text-blue-300">Image Search</h1>
                    <div className="flex space-x-16">
                        <button
                            onClick={handleDashboardPage}
                            className="bg-blue-500 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
                        >
                           Dashboard
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Logout
                        </button>
                    </div>
                </div>
                <input type="file" onChange={handleFileChange} />
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4"
                    disabled={loading}
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </div>
            <div className="w-full max-w-6xl mt-8">
                <h2 className="text-2xl font-bold mb-4 text-blue-300">Search Results</h2>
                <div className="grid grid-cols-3 gap-4">
                    {results.map((result, index) => (
                        <img
                            key={index}
                            src={result.image_url}
                            className="w-full h-auto rounded shadow-md transition-transform transform hover:scale-105"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImageSearch;
